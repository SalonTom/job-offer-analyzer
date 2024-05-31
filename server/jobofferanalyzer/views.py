from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


from jobofferanalyzer.models import Factor, Scores
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from jobofferanalyzer.serializers import FactorSerializer
from jobofferanalyzer.serializers import UserSerializer

from django.views.decorators.csrf import csrf_exempt
import json

from django.contrib.auth import authenticate, login

# Model views

class UserAPIView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, request, *args, **kwargs):
    users = User.objects.all()
    users_serialized = UserSerializer(users, many=True)

    return Response(users_serialized.data)

  def update(self, request):
    try:
      user_id = request.id
      user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
      return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    factors_data = request.factors
    if factors_data:
      scores_to_update = []
      for factor_data in factors_data:
          factor_id = factor_data.id
          score = factor_data.score

          scores_to_update.append(Scores(user=user, factor_id=factor_id, score=score))

      try:
          Scores.objects.bulk_update(scores_to_update)
      except (ValueError, KeyError) as e:
          return Response({'error': f"Invalid data for factor: {e}"}, status=status.HTTP_400_BAD_REQUEST)

      return Response(serializer.data)

    
class FactorAPIView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, *args, **kwargs):
    factors = Factor.objects.all()
    factors_serialized = FactorSerializer(factors, many=True)

    return Response(factors_serialized.data)


# Auth views
class LoginAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        try:
            username = request.data['username']
            password = request.data['password']
        except KeyError:
            return Response({'error': 'Invalid JSON data or missing fields'}, status=400)  # Use status code directly

        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=400)

        try:
            user = authenticate(request, username=username, password=password)
            if user is not None:
                refresh = RefreshToken.for_user(user)  # Create refresh token
                user_serialized = UserSerializer(user)  # Serialize user data
                return Response({
                    'message': 'Login successful',
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user': user_serialized.data
                }, status=200)
            else:
                return Response({'error': 'Invalid username or password'}, status=400)
        except (PermissionError) as e:
            return Response({'error': str(e)}, status=400)  # Handle authentication errors

from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.authtoken.models import Token


from jobofferanalyzer.models import Factor, Scores, JobOfferAnalysis
from django.contrib.auth.models import User
from django.http import HttpRequest, JsonResponse
from jobofferanalyzer.serializers import FactorSerializer, JobOfferAnalysisSerializer, UserSerializer

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

  def patch(self, request):
    try:
      user_id = request.data['id']
      user = User.objects.get(pk=user_id)
    except User.DoesNotExist:
      return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = UserSerializer(user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()

    factors_data = request.data['factors']
    if factors_data:
        try:
            if factors_data:
                for factor_data in factors_data:
                    factor_id = factor_data['id']
                    score = factor_data['score']

                    # Using get_or_create (recommended)
                    defaults = {'score': score}  # Fields to update if object exists
                    score_object, created = Scores.objects.get_or_create(user_id=user_id, factor_id=factor_id, defaults=defaults)

                    if not created:
                        score_object.save()
        except (ValueError, KeyError) as e:
            return Response({'error': f"Invalid data for factor: {e}"}, status=status.HTTP_400_BAD_REQUEST)

    return Response(serializer.data)

    
class FactorAPIView(APIView):
  permission_classes = [IsAuthenticated]

  def get(self, *args, **kwargs):
    factors = Factor.objects.all()
    factors_serialized = FactorSerializer(factors, many=True)

    return Response(factors_serialized.data)
  

class JobOfferAnalysisAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try :
            user_id = request.user # Get the authenticated user from the request.

            if user_id is not None:

                # Get the user's job offer analysis based on the foreign key.
                job_offer_analysis = JobOfferAnalysis.objects.filter(user_id = user_id)
                job_offer_analysis_serialized = JobOfferAnalysisSerializer(job_offer_analysis, many=True)

                return Response(job_offer_analysis_serialized.data, status=status.HTTP_200_OK)
            else:
                return Response({'error' : 'No user found with this id.'}, status=status.HTTP_404_NOT_FOUND)

        except (ValueError, KeyError) as e:
           return Response({'error': f"Invalid data for factor: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def post(self, request):
        try:
            job_offer_data = request.data
            serializer_context = {'request': request}
            job_offer_analysis_serializer = JobOfferAnalysisSerializer(data=job_offer_data, context=serializer_context)
            job_offer_analysis_serializer.is_valid(raise_exception=True)
            job_offer_analysis_serializer.save()

            return Response(job_offer_analysis_serializer.data)

        except (ValueError, KeyError) as e:
            return Response({'error': f"Invalid data for factor: {e}"}, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request):
        try:
            user = request.user # Get the authenticated user from the request.

            if user is not None:
                job_offer_id = request.data['id']  # Assuming the ID is passed in the URL (pk)
                try:
                    job_offer_analysis = JobOfferAnalysis.objects.get(pk=job_offer_id)
                except JobOfferAnalysis.DoesNotExist:
                    return Response({'error': f"Job offer analysis with ID {job_offer_id} not found"}, status=status.HTTP_404_NOT_FOUND)

                job_offer_data = request.data
                job_offer_analysis_serializer = JobOfferAnalysisSerializer(job_offer_analysis, data=job_offer_data, partial=True)
                job_offer_analysis_serializer.is_valid(raise_exception=True)
                job_offer_analysis_serializer.save()

                return Response(job_offer_analysis_serializer.data)

            return Response(job_offer_analysis_serializer.data)

        except (ValueError, KeyError) as e:
            return Response({'error': f"Invalid data for factor: {e}"}, status=status.HTTP_400_BAD_REQUEST)
            

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

class SignUpAPIView(APIView):
  def post(self, request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
      user = serializer.save()
      login(request, user)
      refresh = RefreshToken.for_user(user)
      return Response({
        'user': UserSerializer(user).data,  # Serialize and return user data
        'access': str(refresh.access_token)
      }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
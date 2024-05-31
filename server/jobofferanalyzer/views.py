from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from jobofferanalyzer.models import Factor
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

    def get(self, *args, **kwargs):
        users = User.objects.all()
        users_serialized = UserSerializer(users, many=True)

        return Response(users_serialized.data)
    
class FactorAPIView(APIView):
  # permission_classes = [IsAuthenticated]

  def get(self, *args, **kwargs):
    factors = Factor.objects.all()
    factors_serialized = FactorSerializer(factors, many=True)

    return Response(factors_serialized.data)


# Auth views
class LoginAPIView(APIView):
  def post(self, request):
    try:
      username = request.data['username']
      password = request.data['password']
    except KeyError:
      return Response({'error': 'Invalid JSON data or missing fields'}, status=status.HTTP_400_BAD_REQUEST)

    if username is None or password is None:
      return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=username, password=password)
    print(username, password)
    if user is not None:
      login(request, user)
      complete_user = User.objects.get(id=user.pk)
      user_serialized = UserSerializer(complete_user)
      return Response({'message': 'Login successful', "user" : user_serialized.data}, status=status.HTTP_200_OK)
    else:
      return Response({'error': 'Invalid username or password'}, status=status.HTTP_400_BAD_REQUEST)

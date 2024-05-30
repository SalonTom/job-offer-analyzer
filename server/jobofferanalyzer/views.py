from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response

from jobofferanalyzer.models import Factor
from django.contrib.auth.models import User
from jobofferanalyzer.serializers import FactorSerializer
from jobofferanalyzer.serializers import UserSerializer


class UserAPIView(APIView):
    def get(self, *args, **kwargs):
        users = User.objects.all()
        users_serialized = UserSerializer(users, many=True)

        return Response(users_serialized.data)
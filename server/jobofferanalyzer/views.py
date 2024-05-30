from rest_framework.views import APIView
from rest_framework.response import Response

from rest_framework.views import APIView
from rest_framework.response import Response

from jobofferanalyzer.models import Factor
from jobofferanalyzer.serializers import FactorSerializer


class FactorAPIView(APIView):
    def get(self, *args, **kwargs):
        factors = Factor.objects.all()
        factors_serialized = FactorSerializer(factors, many=True)

        return Response(factors_serialized.data)
from rest_framework.serializers import ModelSerializer
 
from jobofferanalyzer.models import Factor
 
class FactorSerializer(ModelSerializer):
 
    class Meta:
        model = Factor
        fields = ['id', 'name', 'opposite_name', 'description']
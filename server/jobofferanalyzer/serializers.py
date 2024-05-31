from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from jobofferanalyzer.models import Factor, Scores

class FactorSerializer(ModelSerializer):
    score = serializers.SerializerMethodField()

    class Meta:
        model = Factor
        fields = ('id', 'name', 'opposite_name', 'description', 'score')

    def get_score(self, obj):
        user = self.context['user']
        score = Scores.objects.filter(user=user, factor=obj).first()
        return score.score if score else None

class UserSerializer(ModelSerializer):
    factors = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'last_name', 'first_name', 'email', 'factors', 'username']

    def get_factors(self, obj):
        factors = obj.factors.all()
        # Pass the user context to FactorSerializer
        return FactorSerializer(factors, many=True, context={'user': obj}).data
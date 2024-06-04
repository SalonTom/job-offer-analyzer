from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework import serializers
from jobofferanalyzer.models import Factor, JobOfferAnalysis, Scores

class FactorSerializer(ModelSerializer):
    score = serializers.SerializerMethodField()

    def __init__(self, *args, context=None, **kwargs):
        super().__init__(*args, context=context, **kwargs)

        if context is None or 'user' not in context:
            self.fields.pop('score', None) # Remove score field if only retrieving the list of factors.

    class Meta:
        model = Factor
        fields = ['id', 'name', 'opposite_name', 'description', 'score']

    def get_score(self, obj):
        if 'user' in self.context: # If we retrieve user data, we include the score field.
            user = self.context['user']
            score = Scores.objects.filter(user=user, factor=obj).first()
            return score.score if score else None
        return None

class UserSerializer(ModelSerializer):
    factors = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'last_name', 'first_name', 'email', 'factors', 'username']

    def get_factors(self, obj):
        factors = obj.factors.all()
        # Pass the user context to FactorSerializer
        return FactorSerializer(factors, many=True, context={'user': obj}).data
    

class JobOfferAnalysisSerializer(ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user  # Get authenticated user from context
        return JobOfferAnalysis.objects.create(**validated_data)

    class Meta:
        model = JobOfferAnalysis
        fields = ['id', 'company', 'job_title', 'url', 'comment', 'note', 'user']

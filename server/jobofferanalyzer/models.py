from django.db import models
from django.contrib.auth.models import User

class Factor(models.Model):
    name = models.CharField(max_length=255)
    opposite_name = models.CharField(max_length=255)
    description = models.CharField(max_length=500)
    related_users = models.ManyToManyField(User, through='Scores', related_name='factors')

class JobOfferAnalysis(models.Model):
    company = models.CharField(max_length=255)
    job_title = models.CharField(max_length=255)
    url = models.URLField()
    comment = models.CharField(max_length=500)
    note = models.FloatField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Scores(models.Model):
    factor = models.ForeignKey(Factor, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    job_offer_analysis = models.ForeignKey(JobOfferAnalysis, null=True, on_delete=models.CASCADE)
    score = models.IntegerField()
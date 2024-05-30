from django.db import models

class Factor(models.Model):
    name = models.fields.CharField(max_length=255)
    opposite_name = models.fields.CharField(max_length=255)
    description = models.fields.CharField(max_length=500)
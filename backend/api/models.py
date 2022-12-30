from django.db import models


# Create your models here.
class Users(models.Model):
    username = models.CharField(max_length=500)
    password = models.CharField(max_length=500)


class Join(models.Model):
    image1 = models.CharField(max_length=500)
    image2 = models.CharField(max_length=500)
    type1 = models.CharField(max_length=500)
    type2 = models.CharField(max_length=500)
    x_coordinate = models.CharField(max_length=500)
    y_coordinate = models.CharField(max_length=500)



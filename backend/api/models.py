from django.db import models

# Create your models here.
class Users(models.Model):
    username = models.CharField(max_length=500)
    password = models.CharField(max_length=500)


class Join(models.Model):
    x_coordinate = models.CharField(max_length=500)
    y_coordinate = models.CharField(max_length=500)

class Floorplan(models.Model):
    name = models.CharField(max_length=500)
    joins = models.ManyToManyField(Join)



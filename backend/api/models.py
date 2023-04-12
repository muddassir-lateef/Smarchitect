from djongo import models
import uuid

# Crea
# te your models here.
class Join(models.Model):
    type = models.CharField(max_length=500)
    X1 =  models.DecimalField(max_digits=16, decimal_places=8)
    X2 =  models.DecimalField(max_digits=16, decimal_places=8)
    Y1 =  models.DecimalField(max_digits=16, decimal_places=8)
    Y2 =  models.DecimalField(max_digits=16, decimal_places=8)

class Label(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    x = models.DecimalField(max_digits=16, decimal_places=8)
    y = models.DecimalField(max_digits=16, decimal_places=8)
    label = models.CharField(max_length=500)


class Floorplan(models.Model):
    name = models.CharField(max_length=500)
    joins = models.ManyToManyField(Join)
    labels = models.ManyToManyField(Label)
    length = models.DecimalField(max_digits=16, decimal_places=8)
    width = models.DecimalField(max_digits=16, decimal_places=8)


class Users(models.Model):
    username = models.CharField(max_length=500, unique=True)
    password = models.CharField(max_length=500)
    firstname = models.CharField(max_length=500)
    lastname = models.CharField(max_length=500)
    floorplans = models.ManyToManyField(Floorplan)




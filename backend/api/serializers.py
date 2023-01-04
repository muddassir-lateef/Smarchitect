from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from api.models import Users,Join, Floorplan

class UserSerializer(ModelSerializer):
    class Meta:
        model = Users
        fields=('username','password')

class JoinSerializer(ModelSerializer):
    class Meta:
        model = Join
        fields = ('x_coordinate', 'y_coordinate')


class FloorplanSerializer(ModelSerializer):
    class Meta:
        model = Floorplan
        fields = ('name', 'joins')
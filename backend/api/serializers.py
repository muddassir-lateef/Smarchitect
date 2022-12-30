from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from api.models import Users

class UserSerializer(ModelSerializer):
    class Meta:
        model = Users
        fields=('username','password')


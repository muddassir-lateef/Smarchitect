from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from api.models import Users
from api.serializers import UserSerializer

@csrf_exempt
def userAPI(request,id=0):
    if request.method=='GET':
        users = Users.objects.all()
        users_serializer = UserSerializer(users, many = True)
        return JsonResponse(users_serializer.data, safe=False)



    elif request.method=='POST':
        print("Post Hit")
        users_data=JSONParser().parse(request)
        users_serializer = UserSerializer(data={"username":users_data["username"], "password" : users_data["password"]})
        print(users_serializer.is_valid())
        if(users_serializer.is_valid()):
            users_serializer.save()
            return JsonResponse("Added Succesfully", status=201, safe=False)
        return JsonResponse("Failed to Add the User", status=401, safe=False)



    elif request.method=='PUT':
        users_data=JSONParser().parse(request)
        print(users_data)
        users = Users.objects.filter(username = users_data['username'])
        if users.exists():
            print(users)
            users_serializer=UserSerializer(users, data = users_data)
            if users_serializer.is_valid():
                users_serializer.save()
                return JsonResponse("Updated Succesfully", status=201, safe=False)
        return JsonResponse("Failed to Update", status=401, safe=False)

        
    elif request.method=='DELETE':
        user = Users.objects.get(userName=user)
        user.dete()
        return JsonResponse("Deleted Succesfully")

    



# Create your views here.

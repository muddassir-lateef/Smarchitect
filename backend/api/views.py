import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
import pymongo
from api.models import Users, Join, Floorplan
from api.serializers import UserSerializer, JoinSerializer, FloorplanSerializer
connectionString = "mongodb+srv://Salar:Salar123@cluster0.lu89phy.mongodb.net/?retryWrites=true&w=majority"

@csrf_exempt
def userAPI(request,id=0):
    client = pymongo.MongoClient(connectionString)
    db = client['smarchitectdb']


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
            users_serializer=UserSerializer(users, data = users_data)
            if users_serializer.is_valid():
                users_serializer.save()
                return JsonResponse("Updated Succesfully", status=201, safe=False)
        return JsonResponse("Failed to Update", status=401, safe=False)

        
    elif request.method=='DELETE':
        user = Users.objects.get(username=id)
        user.delete()
        return JsonResponse("Deleted Succesfully")

@csrf_exempt
def authenticationApi(request):
     if request.method=='PATCH':
        users_data=JSONParser().parse(request)
        print(users_data["username"])
        user_exists = Users.objects.filter(username=users_data["username"], password=users_data["password"])
        print(user_exists)
        if user_exists:
            print("User Exists")
            user = Users.objects.get(username=users_data["username"])
            print("After Getting")
            print(user.username)
            print("After Serialized")
            users_serializer = UserSerializer(data={"username":users_data["username"], "password" : users_data["password"]})
            return JsonResponse(users_data, safe=False, status = 201)
        return JsonResponse("User Not Found", safe=False, status = 401)

@csrf_exempt
def floorplanApi(request):
    client = pymongo.MongoClient(connectionString)
    db = client['smarchitectdb']

    if request.method=='POST':
        floorplan=JSONParser().parse(request)
        collection=db['api_joins']
        tempFloorplan = Floorplan.objects.create(name = floorplan["name"])
        print(tempFloorplan.name)
        for i in floorplan['Joins']:
            join = Join.objects.create(x_coordinate = str(i['x_coordinate']),y_coordinate= str(i['y_coordinate']))
            print("X : " + str(join.x_coordinate) + "| Y : " + str(join.y_coordinate))
            print(type(join.x_coordinate))
            join.save()
            tempFloorplan.joins.add(join)
        tempFloorplan.save()

        return JsonResponse("Done", safe=False, status = 201)


    if request.method=='GET':
        allFloorplans = Floorplan.objects.all()
        data = [{'Floorplan Name': fp.name, 'Floorplan ID': fp.id} for fp in allFloorplans]
        return JsonResponse(data, safe = False, status = 201)

@csrf_exempt
def singleFloorplanApi(request,fp_Id):
    print("Here")
    if request.method=='GET':

        floorplan = Floorplan.objects.prefetch_related('joins').get(id =fp_Id)
        floorplanDictionary = {}
        floorplanDictionary['Name'] = floorplan.name
        floorplanDictionary['ID'] = fp_Id
        joins = [{'X': join.x_coordinate, 'Y': join.y_coordinate} for join in floorplan.joins.all()]
        floorplanDictionary['Joins'] = joins

    return JsonResponse(floorplanDictionary, safe = False, status = 201)

        



# Create your views here.

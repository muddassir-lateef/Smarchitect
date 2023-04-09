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
from api.genetic_algo import GA_driver

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
        user = Users.objects.create(username = users_data["username"], password = users_data["password"], firstname =users_data['firstname'], lastname = users_data['lastname'])
        user.save()
        return JsonResponse("Added Succesfully", status=201, safe=False)



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
            print(user.id)
            print(user.firstname)
            print("After Serialized")
            UserDictionary = {}
            UserDictionary['username'] = user.username
            UserDictionary['ID'] = user.id
            UserDictionary['firstname'] = user.firstname
            UserDictionary['lastname'] = user.lastname
            print(UserDictionary)
            users_serializer = UserSerializer(data={"username":users_data["username"], "password" : users_data["password"]})
            return JsonResponse(UserDictionary, safe=False, status = 201)
        return JsonResponse("User Not Found", safe=False, status = 400)

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
            join = Join.objects.create(X1= (i['X1']),Y1= (i['Y1']), X2= (i['X2']),Y2= (i['Y2']), type = (i['Type']))
            join.save()
            tempFloorplan.joins.add(join)
        tempFloorplan.width = floorplan["width"]
        tempFloorplan.length = floorplan["length"]
        tempFloorplan.save()
        User = Users.objects.prefetch_related('floorplans').get(id = floorplan["userId"])
        User.floorplans.add(tempFloorplan)

        return JsonResponse("Done", safe=False, status = 201)


    if request.method=='PATCH':
        userDetails = JSONParser().parse(request)
        User = Users.objects.prefetch_related('floorplans').get(id = userDetails['user_Id'])
        print(User.username)
        data = [{'Floorplan_Name': fp.name, 'Floorplan_ID': fp.id} for fp in User.floorplans.all()]
        return JsonResponse(data, safe = False, status = 201)

@csrf_exempt
def singleFloorplanApi(request, fp_Id):
    print("Here")
    if request.method=='GET':
        print(fp_Id)
        tempFloorplan = Floorplan.objects.prefetch_related('joins').get(id = fp_Id)

        floorplanDictionary = {}
        floorplanDictionary['ID'] = tempFloorplan.id
        floorplanDictionary['Name'] = tempFloorplan.name
        Joins = [{'X1': str(join.X1), 'Y1': str(join.Y1), 'X2' : str(join.X2), 'Y2' : str(join.Y2), 'Type' : join.type} for join in tempFloorplan.joins.all()]
        floorplanDictionary['Joins'] = Joins
        print(floorplanDictionary)

    return JsonResponse(floorplanDictionary, safe = False, status = 201)


@csrf_exempt
def GenerateFloorPlan(request):
    print("Here")
    if request.method=='PATCH':
        graphEdges = JSONParser().parse(request)
        print(graphEdges)
        generated_map = GA_driver(graphEdges)
        print(generated_map)
        
    return JsonResponse(generated_map, safe = False, status = 201)
        



# Create your views here.

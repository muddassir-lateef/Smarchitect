import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse
import pymongo
from api.models import Users, Join, Floorplan, Label, Rooms
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

        ##
        #Parsing Data and getting Floorplan
        ##

        floorplan=JSONParser().parse(request)
        collection=db['api_joins']
        tempFloorplan = Floorplan.objects.create(name = floorplan["name"])
        print(tempFloorplan.name)

        ##
        #Creating Join Object
        ##

        for i in floorplan['Joins']:
            join = Join.objects.create(X1= (i['X1']),Y1= (i['Y1']), X2= (i['X2']),Y2= (i['Y2']), type = (i['Type']))
            print("JOIN: {}".format(join))
            join.save()
            tempFloorplan.joins.add(join)
        ##
        #Creating Label Object
        ##
        for i in floorplan['Labels']:
            print(i)
            lab = Label.objects.create(x= (i['x']),y= (i['y']),  label = (i['label']))
            print(lab)
            lab.save()
            tempFloorplan.labels.add(lab)
    
        tempFloorplan.width = floorplan["width"]
        tempFloorplan.length = floorplan["length"]
        
        tempFloorplan.save()
        print("HEre")
        User = Users.objects.prefetch_related('floorplans').get(id = floorplan["userId"])
        print("There")
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
        print("In route")
        print(fp_Id)
        tempFloorplan = Floorplan.objects.prefetch_related('joins').get(id = fp_Id)

        floorplanDictionary = {}
        floorplanDictionary['ID'] = tempFloorplan.id
        floorplanDictionary['Name'] = tempFloorplan.name
        Joins = [{'X1': str(join.X1), 'Y1': str(join.Y1), 'X2' : str(join.X2), 'Y2' : str(join.Y2), 'Type' : join.type} for join in tempFloorplan.joins.all()]
        labels = [{'x': str(label.x), 'y':str(label.y), 'label' : str(label.label)} for label in tempFloorplan.labels.all()]
        floorplanDictionary['Joins'] = Joins
        floorplanDictionary['Labels'] = labels

        print(floorplanDictionary)

    return JsonResponse(floorplanDictionary, safe = False, status = 201)


@csrf_exempt
def GenerateFloorPlan(request):
    print("Here")
    if request.method=='PATCH':
        req = JSONParser().parse(request)
        graphEdges = req['connectors']
        width = 500
        height = 500
        width = req['w']
        height = req['h']
        print("REQ: {}".format(graphEdges))
        print("W: {}".format(width))
        print("H: {}".format(height))
        print(graphEdges)
        generated_map = GA_driver(graphEdges, width, height)
        print(generated_map)
        
    return JsonResponse(generated_map, safe = False, status = 201)
        

@csrf_exempt
def testApi(request):
    if request.method == 'POST':
        print("Hey")
        # Create a new Label object and save it to the database
        floorplan = Floorplan.objects.get(id=137)
        print(floorplan)
        for labels in floorplan.labels.all():
            print(labels.x)
            print(labels.y)
            print(labels.label)
        

        return JsonResponse("Hey", safe = False, status = 201)

@csrf_exempt
def roomApi(request):
    if request.method == 'POST':
        print("Hey")
        # Create a new Label object and save it to the database
        room= Rooms.objects.create(x1=10,x2=11,x3=12,x4=13,y1=2,y2=2,y3=3,y4=4, type="Good")
        print(room)
        room.save()
        print(room.x1)
        return JsonResponse("Hey", safe = False, status = 201)
# Create your views here.

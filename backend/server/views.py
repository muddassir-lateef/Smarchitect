from django.shortcuts import render

def index(request):
    print("Hello")
    return render(request, 'GenerateNewMap.js')
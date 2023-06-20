


# Smarchitect
2D & 3D Floor plan generator. The end goal is to take user constraints as input, and produce a 2D floorplan as output with options to tweak. 3D visualization will also be provided. The frontend is being developed in React, and the backend is in Django, which will be carrying our AI Model.

# Installation Guide
## Deployment
FrontEnd and BackEnd of the project are both dockerized into 2 different images.Both of them are uploaded on a [public repository](https://hub.docker.com/repository/docker/muddassirlateef/smarchitect_01/general) on Dockerhub.

Pull the docker images using the following commands:
```
docker pull muddassirlateef/smarchitect_01:frontend
docker pull muddassirlateef/smarchitect_01:backend
```
And run them using :
```
docker run -d -p 3000:3000 --name Smarchitect_frontend muddassirlateef/smarchitect_01:frontend
docker run -d -p 8000:8000 --name Smarchitect_backend muddassirlateef/smarchitect_01:backend

```

## Development
Pull the code from Github, open it in the IDE of your choice, navigate to the base folder "Smarchitect"

### FRONTEND
To run the frontend, you must have NodeJS Installed and up to date
Once the Repository has been pulled, Run the following commands:
```
cd frontend
npm install
npm start
```

### BACKEND
To run the Django backend, all the necessary library code lines are included in the repo, as well as the database credentials. However, following libraries need to be installed in order to run the backend server. You must have Python version 3.9.x in order to avoid issues with the backend.To install and run the backend , use the following commands:
```
cd backend
pip install django
pip install dnspython
pip install djongo
pip install pymongo==3.12.2
pip install djangorestframework
pip install django-cors-headers
pip install certifi
python manage.py makimigrations api
python manage.py migrate api
python manage.py runserver
```
# Stack
Frontend: ReactJS

Backend: Django

Database: MongoDB

3DConversion: WebGL (Made through Unity)

Along with that we used KonvaJS library for the drawing canvas and used reactwebgl for loading the webgl package for 3d Conversion.


# Usage Guide

## Logging In
By default we have included a demo mongodb cluster for testing this application.
You can login using the following credentials
>Admin:123456

<img src="https://github.com/muddassir-lateef/Smarchitect/assets/41304748/d55b0e67-3b1d-4baf-9501-887b5a6e79b2" width="400" height="500">

## Smart Floor Plan Generation
This module allows the user to get an AI generated floor plan provided land constraints and room connections.
### Providing Land constraints
For this simple click on the 'New Map' Button on the top bar and then enter the land constraints in the given input form at the left of the page.

**Constraints Info:**
* Plot X Dimension : Width of the land in inches
* Plot Y Dimension : Length of the land in inches
* [room type] Count: No of rooms of that specific type needed in the house.
* Convered Area: Percentage of area that is covered in the house.

After filling this from click on 'Draw Nodes' to generate room nodes.

<img src="https://github.com/muddassir-lateef/Smarchitect/assets/41304748/1eac3b0b-037f-40ee-b190-88af2cd8c8f5" >

### Making Room Connections
This step allows you to specify which rooms should be connected in the generated map.Hence allowing more degree of control over the generated map.
For this simply single click on both nodes that you want to join. You can also drag the nodes for better visualization. You must make a fully connected graph. After you are done with the connections click on 'Generate Map'

![roomCon](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/15de5acc-66c9-442b-8c45-2fac877ec349)

### Setting Generation Parameters (Optional)
This steps allows you to have a greate degree of control over the proportions and percentage area of each type of rooms.There are some default values which were carefully selected after consulting Architects. But for better control you are allowed to change these if you like.

**Parameter Info:**
* roomProportion: It allows you to set if the room should be more rectangular or more square like. Values near 1 try to make it as square like as possible.
* roomPercentageArea: It allows you to set the percentage area, which the room should cover on the whole floor plan.

![GAParam](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/a9326b7e-8f30-4e6f-8bd2-6ba76fb68276)

  
## Floor Plan Editor
After creating the plans using AI you are redirected to the editor with the generated floor Plans.Here at the tops you can select from 5 different types of floor plans. There are also a bunch of utilities and tools which are explained in detail below.
![MultiMaps](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/32a04b3e-69f2-4d0e-abab-e537adbf85c5)


**Note:** You can choose to skip the whole AI floor plan generation process to manually draw your own maps by simply using the provided tools. or you can create plan using AI and still modify them in the editor.

### Tools
**Zoom Tool** 
This tools alows you to visualize the floor plan at a certain zoom.
Even in zoomed in mode you can see other parts of floor plan by simply dragging the surface of canvas.

![zoomin](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/69e20ccb-63ec-44b2-95b4-2991fa3a6121)

**Asset Tool** 
These sets of tools allow you to add different floor plan objects.

It includes :

_Door Tool_
>![image](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/7a663fdd-1c3a-40b2-a9ed-d60dd8308a95)

_Wall Tool_
>![image](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/fc1b8862-4bde-4477-ad04-c0d3204eeb4f)

_Window Tool_
>![image](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/b09203e6-451a-410d-b81a-d4e8c54f66b5)

_Stairs Tool_
>![image](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/07b8868f-3f09-4eb4-9e6f-33aa0e7cc840)

**Transform**
Each asset has a transform which allows the object to be rotated or scaled.

### Utilities

**Guiding Lines**
This utiltiy draws guiding lines along the selected and affected objects to make object placement easier.
>![guideLines](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/ac3f1230-9b44-487a-a1eb-cffc304b38a2)

**Automatic Object Snapping**
This utility snaps two objects together when they are sufficiently close . 
>![joinSnap](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/bb387353-9a8e-4b21-9855-6229a9ae53b7)

**Automatic Join Detection**
This utility allows you to detect join between two objects. Join are fundamental for floor plan generation as they are used for detecting rooms, storing and retrieving floorplans. They are also used for 3D visualization of floor plan.
>![JoinDetect](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/378d4007-2480-49fa-bb7b-90af15cea167)


**Automatic Angle Snapping**
This utiltiy allows the object to snap to a specific subsets of angles to make rotation easier.
>![angleSNap](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/a7841024-b493-4850-a93a-8362c2113bee)

**Attribute Window**
This utiltiy allows you to view properties of the selected object. It includes x and y coordinates of the object,its Length(Height), Thickness(Width) and angle.
>![image](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/2abefee8-babe-42cf-9c86-983472324b2e)


The above tools and utilites together allow to modify the map seamlessly.
![Modifyadd](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/58d542bc-914a-437e-9a0b-d0874afff79d)

## 3d Visualization

To visualize the floor plan in unity , just click on the  "Visualize in 3D" button.
You can then rotate the floor plan  by dragging mouse on the unity window. Clicking otuside the window closes the 3D visualization.
![3D](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/fbe30357-ee3a-4206-a55d-9421e64215b0)

This gif is smaller in dimensions due to size limitations.

## Storage and Retrieval of Floor plan

You can name the floor plan using the Save floor Plan section and then save it by clicking on 'Save' button.
You can then also retrieve the saved floor plans by first selecting the "My maps" option. Then viewing these floor plans by clicking on the view button of required floor plan.
![saving](https://github.com/muddassir-lateef/Smarchitect/assets/41304748/9de10205-ff0b-4a8d-9abe-bf47868ca3eb)











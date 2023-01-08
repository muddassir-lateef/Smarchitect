# Smarchitect
How to run the Application:-

Pull the code from Github, open it in the IDE of your choice, navigate to the base folder "Smarchitect"


//FRONTEND
To run the frontend, you must have NodeJS Installed and up to date
Once the Repository has been pulled.
cd frontend
npm install
npm start


//BACKEND
To run the Django backend, all the necessary library code lines are included in the repo, as well as the database credentials. However, following libraries need to be installed in order to run the backend server. You must have Python version 3.9.x in order to avoid issues with the backend.
cd backend
pip install django
pip install dnspython
pip install djongo
pip install pymongo==3.12.2
pip install djongorestframework
pip install djongo-cors-headers
python manage.py makimigrations api
python manage.py migrate api
python manage.py runserver

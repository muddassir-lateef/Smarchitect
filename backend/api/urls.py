from django.urls import re_path as url
from api import views


urlpatterns = [
    url(r'^Users$', views.userAPI),
    url(r'^Users/([0-9]+)$', views.userAPI)
]
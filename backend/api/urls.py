from django.urls import re_path as url
from api import views


from .views import (
    authenticationApi,
    userAPI,
    floorplanApi
)

urlpatterns = [
    url(r'^Users$', views.userAPI),
    url(r'^Users/([0-9]+)$', views.userAPI),
    url(r'^Login$', views.authenticationApi),
    url(r'^Floorplan', views.floorplanApi)
]
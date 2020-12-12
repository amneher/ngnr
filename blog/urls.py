from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.recent, name='blog'),
    path('<post>', views.post_detail),

]

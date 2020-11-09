from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.recent, name='blog'),
    path('<post_id>', views.post_detail),

]

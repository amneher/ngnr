from django.urls import include, path
from . import views

urlpatterns = [
    path('', views.recent),
    path('<post_id>', views.post_detail),

]

"""ngnr URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin, auth
from django.urls import path, include
from django.contrib.auth import views as auth_views
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    #path('accounts/', include('django.contrib.auth.urls')),
    path('', include('home.urls')),
    path('blog/', include('blog.urls')),

        # account management: 
    path('accounts/login', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('accounts/logout', auth_views.LogoutView.as_view(template_name='logout.html'), name='logout'),
    path('', include('social_django.urls', namespace='social')),
    path('signup/', views.signup, name='signup'),
    path('settings/', views.settings, name='settings'),
    path('settings/password/', views.password, name='password'),
    path('settings/deluser/', views.deluser, name='deluser'),
    # import comment app urls:
    #path('comments/', include('django_comments_xtd.urls')),
    #path('settings/accounts/login/', auth_views.LoginView.as_view(template_name='login.html'), name='login'),
]

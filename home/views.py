from django.shortcuts import render

from .models import *


def landing(request):
	return render(request, 'home.html')
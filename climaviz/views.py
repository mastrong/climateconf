from django.shortcuts import render
import os


def index(request):
    return render(request, "index.html")

def institutions(request):
    return render(request, 'institutions.html')

def venue(request):
    return render(request, 'venue.html')

def submissions(request):
    return render(request, 'submissions.html')

def register(request):
    return render(request, 'register.html')
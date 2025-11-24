from django.shortcuts import render
import os


def index(request):
    pw_script = os.getenv("PW_SCRIPT", "")
    return render(request, 'index.html', context={'pw_script': pw_script})

def institutions(request):
    return render(request, 'institutions.html')

def venue(request):
    return render(request, 'venue.html')

def submissions(request):
    return render(request, 'submissions.html')

def register(request):
    return render(request, 'register.html')
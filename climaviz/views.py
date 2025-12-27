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

def terms_conditions(request):
    return render(request, 'terms_conditions.html')

def info(request):
    return render(request, 'info.html')

def privacy(request):
    return render(request, 'privacy.html'
                  )
def contact(request):
    return render(request, 'contact.html')
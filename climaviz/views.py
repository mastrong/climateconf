from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
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

def program(request):
    return render(request, 'program.html')

def preview_abstract_book(request):
    # Standalone site: served as-is, with <base> so its relative links resolve to static files
    path = os.path.join(settings.BASE_DIR, 'static', 'site-html', 'index.html')
    with open(path, encoding='utf-8') as f:
        html = f.read()
    html = html.replace('<head>', '<head>\n<base href="/static/site-html/">', 1)
    return HttpResponse(html)

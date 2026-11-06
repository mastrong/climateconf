from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
import os


def index(request):
    return render(request, "index.html")


# 2026 edition, kept at /archive/2026/
A26 = "archive/2026/"


def archive_2026_index(request):
    return render(request, A26 + 'index.html')


def institutions(request):
    return render(request, A26 + 'institutions.html')

def venue(request):
    return render(request, A26 + 'venue.html')

def submissions(request):
    return render(request, A26 + 'submissions.html')

def terms_conditions(request):
    return render(request, A26 + 'terms_conditions.html')

def info(request):
    return render(request, A26 + 'info.html')

def privacy(request):
    return render(request, A26 + 'privacy.html')
def contact(request):
    return render(request, A26 + 'contact.html')

def program(request):
    return render(request, A26 + 'program.html')

def abstract_book(request):
    # Standalone site: served as-is, with <base> so its relative links resolve to static files
    path = os.path.join(settings.BASE_DIR, 'static', 'archive', '2026', 'site-html', 'index.html')
    with open(path, encoding='utf-8') as f:
        html = f.read()
    html = html.replace('<head>', '<head>\n<base href="/static/archive/2026/site-html/">', 1)
    return HttpResponse(html)

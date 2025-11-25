from django.shortcuts import render, redirect
from django.http import HttpResponse
import os

def pw_gate(request):
    real_pw = os.getenv("DJANGO_SITE_PASSWORD", "")
    error = False

    if request.method == "POST":
        pw = request.POST.get("pw", "")
        if pw == real_pw:
            request.session["site_authed"] = True
            return redirect(request.GET.get("next", "/"))
        else:
            error = True

    return render(request, "pw_gate.html", {"error": error})

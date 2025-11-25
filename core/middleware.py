from django.shortcuts import redirect
from django.urls import reverse


class PasswordGateMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # allow the password page itself
        if request.path == reverse("pw_gate"):
            return self.get_response(request)

        # allow static files
        if request.path.startswith("/static/"):
            return self.get_response(request)

        # allow already authenticated
        if request.session.get("site_authed"):
            return self.get_response(request)

        # not authenticated → redirect
        return redirect(f"{reverse('pw_gate')}?next={request.path}")

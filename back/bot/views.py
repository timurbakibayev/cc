from django.shortcuts import render

# Create your views here.
from django.views.generic.base import TemplateView


class ChatterBotAppView(TemplateView):
    template_name = "bot/app.html"
from django.shortcuts import render
from django.views.generic.base import View, TemplateView
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.decorators.clickjacking import xframe_options_exempt
from .models import *
# Create your views here.

class MainPageView(View):
    def get(self, request):
        return render(request, 'index.html', locals())

class aboutView(View):
    def get(self, request):
        return render(request, 'about.html', locals())


class productsView(View):
    def get(self, request):
        return render(request, 'products.html', locals())

@xframe_options_exempt
class TempView(TemplateView):
    def get(self, request):
        return render(request, 'prlx.html', locals())

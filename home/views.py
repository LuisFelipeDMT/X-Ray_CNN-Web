from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from .forms import *

def home (request):

    return render(request,'home/home.html',{'title':'Home'})


def about (request):
    return render(request,'home/about.html',{'title':'About'})

def upload(request):
    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        print(form.is_valid())
        if form.is_valid():
            form.save()
            print(form)
    else:
        form = PhotoForm()
    return render(request, 'home/upload.html',{'form' : form})

def success(request):
    return HttpResponse('successfully uploaded')

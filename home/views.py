from django.shortcuts import render
from django.http import HttpResponse


def home (request):
    if request.method =='POST':
        uploaded_file=request.FILES['document']
        print(uploaded_file.name)
        print(uploaded_file.size)

    return render(request,'home/home.html',{'title':'Home'})


def about (request):
    return render(request,'home/about.html',{'title':'About'})

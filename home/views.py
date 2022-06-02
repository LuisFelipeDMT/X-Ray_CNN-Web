from time import clock_getres
from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import *
import cloudinary
import cloudinary.uploader
import cloudinary.api
from cloudinary.utils import cloudinary_url
from decouple import config
from random import randint
import requests
import urllib.parse
from django.conf import settings
import pyrebase
from .utils import get_plot


def home (request):


    if request.method == 'POST':
        form = PhotoForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                filename=str(request.FILES['inputfile'])
                ext='.' + filename.split('.')[len(filename.split('.'))-1]
                randval='img_' + str(randint(0,100000000))
                public_id = randval + ext
                file=request.FILES['inputfile']
    #             #Usando Cloudinary
    #             # response = cloudinary.uploader.upload(
    #             #     file,
    #             #     public_id = public_id,
    #             #     folder = "x-ray",
    #             #     overwrite = True
    #             # )
    #             # responseUrl=response['url']

                #Usando Firebase
                config=settings.FIREBASE_CONFIG
                firebase = pyrebase.initialize_app(config)
                storage = firebase.storage()
                auth=firebase.auth()
                response=storage.child("images/" + public_id).put(file)
                img_url=storage.child("images/"+ public_id).get_url(response['downloadTokens'])
                responseUrl=img_url
                apicall_url = f'https://xrimageapi-agg4nfwosq-uc.a.run.app/analyse_image?imageLink='
                features_url=urllib.parse.quote(responseUrl,safe="")
                api_url=apicall_url+features_url
                responseApi = requests.get(api_url)
                print(responseApi.json())
                if(responseApi.status_code==200):
                    probabilities=responseApi.json()['Probabilities']
                    categories=responseApi.json()['Categories']
                    disease=responseApi.json()['Disease']
                    print(probabilities)
                    print(categories)
                    print(disease)
                    zipprobcat=zip(probabilities,categories)
                    x=categories
                    y=probabilities
                    chart=get_plot(x,y)
                    return render(request,'home/report.html',{'title':'Resultado','zipprobcat':zipprobcat,'disease':disease,'chart':chart})
                else:
                    print("Falha de comunicação com a API")
            except:
                print("Verifique a conexão")
    else:
        form = PhotoForm()

    return render(request,'home/home.html',{'title':'Home'})

def about (request):
    return render(request,'home/about.html',{'title':'About'})

def success(request):
    return HttpResponse('successfully uploaded')

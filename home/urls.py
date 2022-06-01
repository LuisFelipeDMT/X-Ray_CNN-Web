from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('', views.home, name='home-home'),
    path('about', views.about, name='home-about'),
    path('upload', views.upload, name = 'home-upload'),
    path('success', views.success, name = 'home-success'),
]

if settings.DEBUG:
        urlpatterns += static(settings.MEDIA_URL,
                              document_root=settings.MEDIA_ROOT)

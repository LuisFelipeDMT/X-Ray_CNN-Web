from hashlib import md5
from django.db import models


# Create your models here.

class Photo(models.Model):
    inputfile = models.ImageField(upload_to='images/')

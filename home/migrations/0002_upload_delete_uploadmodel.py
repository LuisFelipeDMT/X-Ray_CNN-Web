# Generated by Django 4.0.4 on 2022-06-01 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='upload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=50)),
                ('upload', models.FileField(upload_to='media')),
            ],
        ),
        migrations.DeleteModel(
            name='UploadModel',
        ),
    ]

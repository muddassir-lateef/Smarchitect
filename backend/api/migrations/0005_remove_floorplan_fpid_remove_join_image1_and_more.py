# Generated by Django 4.1.3 on 2023-01-03 10:13

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_floorplan'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='floorplan',
            name='fpId',
        ),
        migrations.RemoveField(
            model_name='join',
            name='image1',
        ),
        migrations.RemoveField(
            model_name='join',
            name='image2',
        ),
        migrations.RemoveField(
            model_name='join',
            name='type1',
        ),
        migrations.RemoveField(
            model_name='join',
            name='type2',
        ),
    ]

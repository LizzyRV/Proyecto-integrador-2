# Generated by Django 5.1.1 on 2024-09-17 13:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('consultorio', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='citas',
            name='estado',
            field=models.CharField(default='activa', max_length=10),
        ),
    ]
# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2018-03-14 05:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('cc', '0009_template'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='customer',
            options={'ordering': ['-last_message_time']},
        ),
        migrations.AddField(
            model_name='customer',
            name='last_message_time',
            field=models.DateTimeField(auto_now=True),
        ),
    ]

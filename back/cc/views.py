#!/usr/bin/env python
# -*- coding: utf-8 -*-
from datetime import datetime, timedelta
from django.contrib.auth.models import User
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, response
from django.http import HttpResponseRedirect
import json
from django.utils.datetime_safe import datetime
from django.core import serializers
from cc.models import *
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response

from cc import telegram


@csrf_exempt
def index(request):
    return render(request, "index.html", {})


@api_view(['POST'])
def new_message(request):
    if request.method == "POST":
        # print("request", request.data)
        customer = request.data["customer"]
        message = request.data["message"]
        # print("new message post", message,client_id)
        the_message = Message()
        the_message.customer = Customer.objects.get(pk=int(customer))
        the_message.isReply = True
        the_message.message = message
        try:
            if the_message.customer.device_type == "telegram":
                telegram.reply(the_message.customer.device_id, the_message.message)
                the_message.save()
        except Exception as e:
            print("failed to send to customer: " + str(e))
            return Response({"result": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"result":"ok"}, status=status.HTTP_201_CREATED)


def human_time(the_time):
    the_time = str(the_time + timedelta(hours=6))[:16]
    today = str(datetime.datetime.now())
    if today[:10] == the_time[:10]:
        the_time = the_time[11:]
    return str(the_time)[:16]

@csrf_exempt
def messages(request):
    if request.method == "GET":
        filtered_list = []
        for customer in Customer.objects.filter(hidden=False):
            messages = []
            unread = 0

            for message in customer.message_set.all():
                messages.append({"id": message.id,
                                 "reply": (0,1)[message.isReply],
                                 "message": message.message,
                                 "time": human_time(message.time),
                                 })
                if message.isReply:
                    unread = 0
                else:
                    unread += 1
            filtered_list.append({
                "order": customer.ordering,
                "unread": unread,
                "id": customer.id,
                "reply": customer.reply,
                "name": customer.name,
                "messages": messages})
        return HttpResponse(json.dumps(filtered_list))


@csrf_exempt
def hide(request, pk):
    if request.method == "GET":
        Customer.objects.get(pk=pk)
        Customer.hidden = True
        Customer.save()
        return HttpResponse(json.dumps({"Result":"Hidden"}))

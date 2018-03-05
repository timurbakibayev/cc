#!/usr/bin/env python
# -*- coding: utf-8 -*-
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
        the_message.save()
        try:
            if the_message.customer.device_type == "telegram":
                telegram.reply(the_message.customer.device_id, the_message.message)
        except Exception as e:
            print("failed to send to customer: " + str(e))
        return Response({"result":"ok"}, status=status.HTTP_201_CREATED)


@csrf_exempt
def messages(request):
    if request.method == "GET":
        filtered_list = []
        for customer in Customer.objects.filter(hidden=False):
            messages = []
            for message in customer.message_set.all():
                messages.append({"id": (1,0)[message.isReply], "message": message.message})
            filtered_list.append({
                "order": customer.ordering,
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

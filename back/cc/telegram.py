# -*- coding: utf-8 -*-
import time
import random
import telebot

from cc.models import Customer
from cc.models import Message


bot = telebot.TeleBot("451447638:AAH7fIXtg1ASXNEz9VQEwNNTDQbiqt14rB8")

fake_messages = [
    "Hi", "How are you?", "What are you doing?", "So what?", "What should I do?!!", "Hello, there!",
    "I need something from your company. May be I should ensure something I have? I don't know. Help me.",
    "Yellow submarine, yellow submarine, yellow submarine, yellow submarine, yellow submarine, yellow submarine, yellow submarine, yellow submarine, yellow submarine, HEY!",
]


@bot.message_handler(content_types=["text"])
def receive_all_messages(tele_message):
    thank_you = False
    try:
        customer = Customer.objects.filter(device_type="telegram").get(device_id=tele_message.chat.id)
        customer.hidden = False
        customer.save()
        if customer.context == "name":
            customer.name = tele_message.text.strip()
            customer.context = ""
            customer.save()
            thank_you = True
    except:
        customer = Customer()
        customer.device_id = tele_message.chat.id
        customer.context = "name"
        customer.save()
        reply(customer.device_id, "Добро пожаловать в чат-центр Centras!", with_save=True, customer=customer)
        reply(customer.device_id, "Пожалуйста, введите своё имя", with_save=True, customer=customer)
    message = Message()
    message.customer = customer
    message.message = tele_message.text
    message.isReply = False
    message.save()
    if thank_you:
        reply(customer.device_id, "Спасибо большое, {}. Чем мы можем Вам помочь?".format(customer.name), with_save=True, customer=customer)


def reply(device_id, message, with_save=False, customer=None):
    bot.send_message(device_id, message)
    if with_save:
        m = Message()
        m.customer = customer
        m.message = message
        m.isReply = True
        m.save()


def start():
    bot.polling(none_stop=True)

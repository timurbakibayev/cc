import datetime
from django.db import models
from django.db.models.signals import post_save


class Template(models.Model):
    question = models.CharField(max_length=5000, default="")
    reply = models.CharField(max_length=5000, default="")

    def __str__(self):
        return self.question + ":" + self.reply

    class Meta:
        ordering = ["-id"]


class Customer(models.Model):
    name = models.CharField(max_length=1000, default="-")
    firstContactTime = models.DateTimeField(auto_now_add=True)
    ordering = models.IntegerField(default=0)
    reply = models.CharField(default="", max_length=2000)
    hidden = models.BooleanField(default=False)
    phone_no = models.CharField(default="-", max_length=20)
    device_id = models.CharField(max_length=1000)
    device_type = models.CharField(max_length=1000, default="telegram")
    context = models.CharField(max_length=1000, default="")
    operator_id = models.IntegerField(default=0)
    last_message_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name + " " + self.device_type

    class Meta:
        ordering = ["-last_message_time"]


class Message(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now=True)
    message = models.CharField(max_length=10000)
    isReply = models.BooleanField(default=False)

    def __str__(self):
        return self.customer.name + " " + self.message + " "

    class Meta:
        ordering = ["time"]


class Log(models.Model):
    username = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=1000)
    result = models.CharField(max_length=100)
    positive = models.BooleanField(default=False)

    def __str__(self):
        return str(self.date) + " " + self.username + ": " + self.action

    class Meta:
        ordering = ["-date"]


class Counter(models.Model):
    value = models.IntegerField(default=0)


def on_customer_save(sender, instance, **kwargs):
    if kwargs['created']:
        try:
            g = Counter.objects.get(pk=0).value
        except:
            g = 0
        g -= 1
        c = Counter()
        c.id = 0
        c.value = g
        c.save()
        instance.ordering = g
        instance.save()


def on_message_save(sender, instance, **kwargs):
    if kwargs['created']:
        try:
            c = Customer.objects.get(pk=instance.customer_id)
            c.ordering = -(instance.time.replace(tzinfo=None) - datetime.datetime(2018,1,1)).total_seconds()
            c.save()
        except Exception as e:
            print(str(e))
            pass

post_save.connect(on_customer_save, sender=Customer)
post_save.connect(on_message_save, sender=Message)
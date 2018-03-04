from django.db import models


class Customer(models.Model):
    name = models.CharField(max_length=1000, default="-")
    firstContactTime = models.DateTimeField(auto_now_add=True)
    ordering = models.IntegerField(default=0)
    reply = models.CharField(default="", max_length=2000)
    hidden = models.BooleanField(default=False)
    phone_no = models.CharField(default="-", max_length=20)
    device_id = models.CharField(max_length=1000)
    device_type = models.CharField(max_length=1000, default="telegram")
    operator_id = models.IntegerField(default=0)

    def __str__(self):
        return self.name + " " + self.device_type

    class Meta:
        ordering = ["ordering"]


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

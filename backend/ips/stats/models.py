from django.db import models
from django.utils.timezone import datetime
from model_utils import Choices


class CPUInfo(models.Model):
    url = models.URLField(blank=True)
    value = models.DecimalField(max_digits=6, decimal_places=3)
    timestamp = models.DateTimeField(default=datetime.now)


class NetworkInfo(models.Model):
    TYPES = Choices("main_frame", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other")
    METHODS = Choices("GET", "POST")

    source_url = models.URLField(max_length=1000, blank=True)
    destination_url = models.URLField(max_length=1000, blank=True)
    method = models.CharField(max_length=10, choices=METHODS, default=METHODS.GET)
    http_status = models.CharField(max_length=3, blank=True)
    type = models.CharField(max_length=15, choices=TYPES, default=TYPES.main_frame)
    timestamp = models.DateTimeField(default=datetime.now)


class DOMElementCount(models.Model):
    url = models.URLField(blank=True)
    element_name = models.CharField(max_length=30)
    count = models.IntegerField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

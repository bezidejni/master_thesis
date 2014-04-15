from django.contrib import admin
from .models import CPUInfo, NetworkInfo

admin.site.register(CPUInfo)
admin.site.register(NetworkInfo)

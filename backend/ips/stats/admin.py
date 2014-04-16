from django.contrib import admin
from .models import CPUInfo, NetworkInfo, DOMElementCount

admin.site.register(CPUInfo)
admin.site.register(NetworkInfo)
admin.site.register(DOMElementCount)

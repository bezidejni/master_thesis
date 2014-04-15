from django.conf.urls import patterns, include, url
from django.contrib import admin
from rest_framework import routers
from stats.views import CPUInfoViewSet, NetworkInfoViewSet

admin.autodiscover()

router = routers.DefaultRouter()
router.register('cpuinfo', CPUInfoViewSet)
router.register('network-info', NetworkInfoViewSet)

urlpatterns = patterns('',
    url(r'^', include(router.urls)),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^admin/', include(admin.site.urls)),
)

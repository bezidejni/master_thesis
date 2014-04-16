import json
from django.db.models import Count
from django.views.generic import TemplateView
from rest_framework import viewsets
from .models import CPUInfo, NetworkInfo, DOMElementCount
from .serializers import CPUInfoSerializer, NetworkInfoSerializer, DOMElementCountSerializer


class HomeView(TemplateView):
    template_name = 'home.html'

    def get_context_data(self, **kwargs):
        context = super(HomeView, self).get_context_data(**kwargs)
        context['network'] = NetworkInfo.objects.order_by('-timestamp')[:10]
        context['dom'] = DOMElementCount.objects.order_by('-timestamp')[:10]
        context['cpu'] = CPUInfo.objects.order_by('-timestamp')[:10]

        cpu_value_data = CPUInfo.objects.order_by('timestamp').values_list('value', flat=True)
        cpu_value_data = map(float, cpu_value_data)
        context['cpu_value_data'] = json.dumps(cpu_value_data)
        cpu_time_data = CPUInfo.objects.order_by('timestamp').values_list('timestamp', flat=True)
        cpu_time_data = [x.strftime('%H:%M:%S') for x in cpu_time_data]
        context['cpu_time_data'] = json.dumps(cpu_time_data)

        http = NetworkInfo.objects.values('http_status').annotate(count=Count('http_status'))
        http_list = [(str(x['http_status']), x['count']) for x in http]
        context['http_list'] = json.dumps(http_list)

        return context


class CPUInfoViewSet(viewsets.ModelViewSet):
    queryset = CPUInfo.objects.all()
    serializer_class = CPUInfoSerializer

    def get_serializer(self, instance=None, data=None,
                       files=None, many=False, partial=False):
        return self.serializer_class(instance, data, files, True, partial)


class DOMElementCountViewSet(viewsets.ModelViewSet):
    queryset = DOMElementCount.objects.all()
    serializer_class = DOMElementCountSerializer

    def get_serializer(self, instance=None, data=None,
                       files=None, many=False, partial=False):
        return self.serializer_class(instance, data, files, True, partial)


class NetworkInfoViewSet(viewsets.ModelViewSet):
    queryset = NetworkInfo.objects.all()
    serializer_class = NetworkInfoSerializer

    def get_serializer(self, instance=None, data=None,
                       files=None, many=False, partial=False):
        return self.serializer_class(instance, data, files, True, partial)

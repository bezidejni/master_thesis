from rest_framework import viewsets
from .models import CPUInfo, NetworkInfo, DOMElementCount
from .serializers import CPUInfoSerializer, NetworkInfoSerializer, DOMElementCountSerializer


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

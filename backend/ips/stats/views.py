from rest_framework import viewsets
from .models import CPUInfo, NetworkInfo
from .serializers import CPUInfoSerializer, NetworkInfoSerializer


class CPUInfoViewSet(viewsets.ModelViewSet):
    queryset = CPUInfo.objects.all()
    serializer_class = CPUInfoSerializer


class NetworkInfoViewSet(viewsets.ModelViewSet):
    queryset = NetworkInfo.objects.all()
    serializer_class = NetworkInfoSerializer

    def get_serializer(self, instance=None, data=None,
                       files=None, many=False, partial=False):
        return self.serializer_class(instance, data, files, True, partial)
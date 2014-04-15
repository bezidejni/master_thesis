from rest_framework import viewsets
from .models import CPUInfo, NetworkInfo
from .serializers import CPUInfoSerializer, NetworkInfoSerializer


class CPUInfoViewSet(viewsets.ModelViewSet):
    queryset = CPUInfo.objects.all()
    serializer_class = CPUInfoSerializer


class NetworkInfoViewSet(viewsets.ModelViewSet):
    queryset = NetworkInfo.objects.all()
    serializer_class = NetworkInfoSerializer

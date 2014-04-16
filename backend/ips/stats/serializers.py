from django.utils.timezone import datetime
from rest_framework import serializers
from .models import CPUInfo, NetworkInfo, DOMElementCount


class UnixEpochDateField(serializers.DateTimeField):
    def from_native(self, value):
        import datetime
        print value
        return datetime.datetime.fromtimestamp(float(value)/1000.0)


class CPUInfoSerializer(serializers.ModelSerializer):
    timestamp = UnixEpochDateField(default=datetime.now, required=False)

    class Meta:
        model = CPUInfo


class NetworkInfoSerializer(serializers.ModelSerializer):
    timestamp = UnixEpochDateField(default=datetime.now, required=False)

    class Meta:
        model = NetworkInfo


class DOMElementCountSerializer(serializers.ModelSerializer):
    class Meta:
        model = DOMElementCount

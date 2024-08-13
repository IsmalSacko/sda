# properties/serializers.py

from rest_framework import serializers
from .models import City, Zone, Property, Reservation


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class ZoneSerializer(serializers.ModelSerializer):
    city = CitySerializer()

    class Meta:
        model = Zone
        fields = '__all__'


class PropertySerializer(serializers.ModelSerializer):
    zone = ZoneSerializer()
    price_in_fcfa = serializers.SerializerMethodField() # Custom field to convert price to FCFA

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price', 'price_in_fcfa', 'zone', 'available']

    def get_price_in_fcfa(self, obj):
        return obj.price_in_fcfa()


class ReservationSerializer(serializers.ModelSerializer):
    property = PropertySerializer()
    user = serializers.StringRelatedField()

    class Meta:
        model = Reservation
        fields = '__all__'

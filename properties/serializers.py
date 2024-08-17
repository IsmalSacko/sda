# properties/serializers.py

from rest_framework import serializers
from .models import City, Zone, Property, Reservation

# Sérialisation des villes
class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'
        
 # Sérialisation des zones  avec la ville associée       
class ZoneSerializer(serializers.ModelSerializer):
    city = serializers.PrimaryKeyRelatedField(queryset=City.objects.all())
    city_name = serializers.CharField(source='city.name', read_only=True)

    class Meta:
        model = Zone
        fields = '__all__'


# properties/serializers.py


class PropertySerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.all())
    zone_name = serializers.CharField(source='zone.name', read_only=True)
    zone_city = serializers.CharField(source='zone.city.name', read_only=True)
    
    price_in_fcfa = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price', 'price_in_fcfa', 'zone_city','zone','zone_name', 'available', 'image']

    def get_price_in_fcfa(self, obj):
        return obj.price_in_fcfa()
       


class ReservationSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    image = serializers.ImageField(source='property.image', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)
    property_title = serializers.CharField(source='property.title', read_only=True)
    property_price = serializers.DecimalField(source='property.price_in_fcfa', read_only=True, max_digits=10, decimal_places=0)
    property_zone = serializers.CharField(source='property.zone.name', read_only=True)
    property_city = serializers.CharField(source='property.zone.city.name', read_only=True)
    user = serializers.StringRelatedField(read_only=True)  # Lecture seule, l'utilisateur est déterminé par la requête

    class Meta:
        model = Reservation
        fields = ['id', 
                  'property', 
                  'user', 
                  'username', 
                  'date_reserved', 
                  'check_in', 
                  'check_out', 
                  'property_title', 
                  'property_price', 
                  'property_zone', 
                  'property_city',
                    'image'
                  ]

    def create(self, validated_data):
        
        # Associe automatiquement la réservation à l'utilisateur connecté
        user = self.context['request'].user
        reservation = Reservation.objects.create(user=user, **validated_data)
        
        return reservation

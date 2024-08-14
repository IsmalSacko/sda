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

    class Meta:
        model = Zone
        fields = '__all__'


# properties/serializers.py


class PropertySerializer(serializers.ModelSerializer):
    zone = serializers.PrimaryKeyRelatedField(queryset=Zone.objects.all())
    zone_name = serializers.CharField(source='zone.name')
    price_in_fcfa = serializers.SerializerMethodField()

    class Meta:
        model = Property
        fields = ['id', 'title', 'description', 'price', 'price_in_fcfa', 'zone','zone_name', 'available', 'image']

    def get_price_in_fcfa(self, obj):
        return obj.price_in_fcfa()

    def to_representation(self, instance):
        """
        Object instance to dict transformation, hide fields for non-managers.
        """
        representation = super().to_representation(instance)
        request = self.context.get('request', None)
        if request and not request.user.groups.filter(name='managers').exists():
            # Supprimer les champs sensibles si l'utilisateur n'est pas un manager
            representation.pop('price')
            representation.pop('zone')
            representation.pop('available')
        return representation



       


class ReservationSerializer(serializers.ModelSerializer):
    property = serializers.PrimaryKeyRelatedField(queryset=Property.objects.all())
    user = serializers.StringRelatedField(read_only=True)  # Lecture seule, l'utilisateur est déterminé par la requête

    class Meta:
        model = Reservation
        fields = '__all__'

    def create(self, validated_data):
        # Associe automatiquement la réservation à l'utilisateur connecté
        user = self.context['request'].user
        reservation = Reservation.objects.create(user=user, **validated_data)
        return reservation

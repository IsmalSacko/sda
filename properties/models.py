from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class City(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Zone(models.Model):
    name = models.CharField(max_length=100)
    city = models.ForeignKey(City, related_name='zonnes', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.name} - ({self.city.name})"


# properties/models.py

class Property(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Prix en EUR
    zone = models.ForeignKey(Zone, related_name='properties', on_delete=models.CASCADE)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.title

    def price_in_fcfa(self):
        return float(self.price) * 655.957  # Conversion EUR to FCFA


class Reservation(models.Model):
    property = models.ForeignKey(Property, related_name='reservations', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reservations', on_delete=models.CASCADE)
    date_reserved = models.DateTimeField(auto_now_add=True)
    check_in = models.DateField()
    check_out = models.DateField()

    def __str__(self):
        return f"Reservation of {self.property} by {self.user.username}"
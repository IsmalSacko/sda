# properties/admin.py

from django.contrib import admin
from .models import City, Zone, Property, Reservation


class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'price', 'price_in_fcfa', 'available')

    def price_in_fcfa(self, obj):
        return obj.price_in_fcfa()

    price_in_fcfa.short_description = 'Prix (FCFA)'


admin.site.register(City)
admin.site.register(Zone)
admin.site.register(Property, PropertyAdmin)
admin.site.register(Reservation)

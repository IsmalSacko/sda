from rest_framework import permissions


class IsManager(permissions.BasePermission):
    """
    Permission to only allow users in the "managers" group to update objects.
    """

    def has_permission(self, request, view):
        # This only checks for general permission to access the view. 
        # Since we are interested in update permissions specifically, this might not be necessary.
        return True

    def has_object_permission(self, request, view, obj):
        # Allow GET, HEAD or OPTIONS requests for all users
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only allow update if the user is in the "managers" group
        return request.user.groups.filter(name='managers').exists()
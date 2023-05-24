from django.urls import path, include
from rest_framework import routers

from .views import EventViewSet, EventOptionViewSet, VoteViewSet

router = routers.DefaultRouter()
router.register(r'', EventViewSet)
router.register(r'options', EventOptionViewSet)
router.register(r'votes', VoteViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import JsonResponse
from django_elasticsearch_dsl.search import Search
from .models import *
from .documents import *
from .serializer import *

from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication


class EventViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'])
    def add_option(self, request, pk=None):
        event = self.get_object()
        date_time = request.data.get('date_time')
        event.add_option(date_time)
        serializer = self.get_serializer(event)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        event = self.get_object()
        option_id = request.data.get('option_id')
        event.vote_option(option_id)
        serializer = self.get_serializer(event)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def close(self, request, pk=None):
        event = self.get_object()
        event.close()
        serializer = self.get_serializer(event)
        return Response(serializer.data)


class EventOptionViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = EventOption.objects.all()
    serializer_class = EventOptionSerializer


class VoteViewSet(viewsets.ModelViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    queryset = Vote.objects.all()
    serializer_class = VoteSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        option = instance.option
        self.perform_destroy(instance)
        option.save()  # update the total votes count
        serializer = self.get_serializer(option)
        return Response(serializer.data)


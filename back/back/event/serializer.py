from rest_framework import serializers

from .models import Event, EventOption, Vote


class VoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'


class EventOptionSerializer(serializers.ModelSerializer):
    votes = VoteSerializer(many=True, read_only=True)

    class Meta:
        model = EventOption
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    options = EventOptionSerializer(many=True, read_only=True)

    class Meta:
        model = Event
        fields = '__all__'
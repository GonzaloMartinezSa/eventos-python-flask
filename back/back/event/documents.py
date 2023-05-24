from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from .models import Event, EventOption, Vote

@registry.register_document
class EventDocument(Document):
    class Index:
        name = 'events'

    class Django:
        model = Event
        fields = [
            'name',
            'available',
            'created_at',
            'final_date'
        ]

@registry.register_document
class EventOptionDocument(Document):
    event_name = fields.TextField()
    votes = fields.IntegerField()

    class Index:
        name = 'event_options'

    class Django:
        model = EventOption
        fields = [
            'date_time',
        ]

    def prepare_event_name(self, instance):
        return instance.event.name
    
    def prepare_votes(self, instance):
        return instance.votes.count()

@registry.register_document
class VoteDocument(Document):
    
    username = fields.TextField()
    event_name = fields.TextField()
    option = fields.TextField()

    class Index:
        name = 'votes'

    class Django:
        model = Vote
        fields = [
            'timestamp',
        ]
    
    def prepare_username(self, instance):
        return None #instance.user.username
    
    def prepare_event_name(self, instance):
        return instance.option.event.name
    
    def prepare_option(self, instance):
        return instance.option.date_time
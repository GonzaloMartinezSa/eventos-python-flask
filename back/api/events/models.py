from mongoengine import Document, DateTimeField, ListField, ReferenceField, StringField, BooleanField
from users.models import User
from datetime import datetime

class Vote(Document):
    voter = ReferenceField(User, required=True)
    timestamp = DateTimeField(required=True, default=datetime.now)
    
    def to_json(self):
        return {
            "id": str(self.id),
            "voter": self.voter.to_json(),
            "timestamp": str(self.timestamp),
        }


class EventOption(Document):

    timestamp = DateTimeField(required=True, default=datetime.now)
    votes = ListField(ReferenceField(Vote))

    def vote(self, voter):
        vote = Vote(voter=voter)
        vote.save()
        self.votes.append(vote)
        self.save()

    def has_voted(self, new_voter_id):
        return any(vote.voter == new_voter_id for vote in self.votes)

    def total_votes(self):
        return len(self.votes)

    def to_json(self):
        return {
            "id": str(self.id),
            "datetime": str(self.timestamp),
            "votes": self.total_votes(),
        }


class Event(Document):
    name = StringField(required=True)
    options = ListField(ReferenceField(EventOption))
    available = BooleanField(default=True)
    created_at = DateTimeField(required=True, default=datetime.now)
    final_date = DateTimeField()
    creator = ReferenceField(User, required=True)

    def add_option(self, event_option):
        self.options.append(event_option)
        self.save()

    def vote_option(self, option, voter):
        
        if self.available:
            option = EventOption.objects(id=option).first()
            if not option:
                raise OptionNotFoundException("Option not found")
            if option.has_voted(voter):
                raise CannotVoteTwiceException("Cannot vote the same option twice")
            option.vote(voter)
        else:
            raise ClosedEventException("Cannot vote in a closed event")

    def close(self):
        self.available = False
        if len(self.options) == 0:
            raise ClosedEventException("No options available")

        winner = max(self.options, default=None, key=lambda option: option.total_votes())
        self.final_date = winner.timestamp
        self.save()

    def created_in_the_last_2_hours(self):
        now = datetime.datetime.now()
        hour_diff = round((now - self.created_at).total_seconds() / 3600, 2)
        return hour_diff <= 2
    

    def to_json(self):
        option_json = list(map(lambda option: option.to_json(), self.options))
        
        return {
            'id': str(self.id),
            'name': self.name,
            'available': self.available,
            'created_at': self.created_at,
            'final_date': self.final_date,
            'options': option_json,
            'creator': self.creator.to_json(),
        }
    

class ClosedEventException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class CannntVoteTwiceException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class OptionNotFoundException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class CannotVoteTwiceException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)
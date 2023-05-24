from flask import jsonify, request
from flask_login import UserMixin
from werkzeug.security import check_password_hash
from app import db
import uuid
import datetime

# placeholder
id_counter = 0

class ClosedEventException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class CannntVoteTwiceException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class User(UserMixin):
    id : int
    username : str
    password : str
    
    def __init__(self, username, password):
        global id_counter
        id_counter+=1
        self.id = id_counter
        self.username = username
        self.password = password

    def is_authenticated(self):
        # Check if the user has provided valid credentials and is allowed to be authenticated
        # Return True or False accordingly
        if self.password:
            return check_password_hash(self.password, request.get_json()['password'])
        return False

    def is_active(self):
        # Check if the user is active and allowed to be authenticated
        # Return True or False accordingly
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)
    
    #para probar
    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "password": self.password,
        }
    
class Vote():
    #voter = db.ReferenceField(User, required=True)
    #option = db.DateTimeField(required=True)
    voter_id: int
    voted_at : datetime

    def __init__(self, voter_id):
        self.voted_at = datetime.datetime.now()
        self.voter_id = voter_id


class EventOption():
    id_option : int
    date_time : datetime
    votes = [] # Lista de Votes


    def __init__(self, datetime):
        global id_counter 
        id_counter+=1
        self.id_option = id_counter
        self.date_time = datetime
        self.votes = new_empty_list()

    def vote(self, voter_id):
        vote = Vote(voter_id)
        self.votes.append(vote)

    def has_voted(self, new_voter_id):
        return any(vote.voter_id == new_voter_id for vote in self.votes)
        
    def total_votes(self):
        return len(self.votes)

    def to_json(self):
        return {
            "id": self.id_option,
            "datetime": self.date_time,
            "votes": self.total_votes(),
        }


class Event():
    id: int
    name : str
    options = [] # Lista de EventOptions
    available : bool
    created_at : datetime
    final_date : datetime
    creator_id : int

    def __init__(self, name, creator_id, options=[]):
        if len(options) == 0: options = new_empty_list()
        global id_counter 
        id_counter+=1
        self.id = id_counter
        self.name = name
        self.creator_id = creator_id
        self.options = options
        self.available = True
        self.created_at = datetime.datetime.now()
        self.final_date = None

    def add_option(self, event_option):
        self.options.append(event_option)

    def vote_option(self, option_id, voter_id):
        if self.available:
            # self.options[int(option_id) - 1].vote()  # rever index según db.
            optiones = list(filter(lambda op: op.id_option == int(option_id), self.options))
            option = optiones[0]
            if option.has_voted(voter_id):
                raise CannntVoteTwiceException("Cannot vote the same option twice")
            option.vote(voter_id)
        else:
            raise ClosedEventException("Cannot vote in a closed event")

    def close(self):
        self.available = False
        if len(self.options) == 0 :
            raise ClosedEventException("no hay eventos")
        
        winner = max(self.options, default=None, key=lambda option: option.total_votes())
        self.final_date = winner.date_time

    def created_in_the_last_2_hours(self):
        now = datetime.datetime.now()
        hour_diff = round((now - self.created_at).total_seconds() / 3600, 2) 
        return hour_diff <= 2


    def to_json(self):
        option_json = list(map(lambda option: option.to_json(), self.options))
        return {
            'id': self.id,
            'name': self.name,
            'available': self.available,
            'created_at': self.created_at,
            'final_date': self.final_date,
            'options': option_json,
            'creator_id': self.creator_id,
        }
    
def new_empty_list():
    return [[] for _ in range(1)][0]

'''
class User(db.Document, UserMixin):
    username = db.StringField(required=True)
    password = db.StringField(required=True)
    
    def is_authenticated(self):
        # Check if the user has provided valid credentials and is allowed to be authenticated
        # Return True or False accordingly
        if self.password:
            return check_password_hash(self.password, request.form['password'])
        return False

    def is_active(self):
        # Check if the user is active and allowed to be authenticated
        # Return True or False accordingly
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)

# class User(Document, UserMixin):
#     name = StringField(required=True, max_length=100)
#     events = []

#     def __init__(self, name, events, *args, **kwargs):
#         super(Document, self).__init__(*args, **kwargs)
#         self.name = name
#         self.events = events

#     meta = {'collection': 'users'}

# class Vote(EmbeddedDocument):
#     user = ReferenceField(User, required=True, reverse_delete_rule=4) -> no se puede en embeddDoc
#     created_at = DateTimeField(default=datetime.datetime.now)

#     def __init__(self, user, *args, **kwargs):
#         super(EmbeddedDocument, self).__init__(*args, **kwargs)
#         self.user = user
#         self.created_at = datetime.datetime.now()


class EventOption(db.EmbeddedDocument):
    # se puede hacer un diccionario/map tipo {'id_option': unEventOption} desde 'Event'
    #id_option = db.UUIDField(default=uuid.uuid4, binary=False)
    id_option = db.IntField()
    datetime = db.DateTimeField(required=True)
    # votes = EmbeddedDocumentListField(Vote)
    votes = db.IntField()


    def __init__(self, id, datetime, *args, **kwargs):
        super(db.EmbeddedDocument, self).__init__(*args, **kwargs)
        self.id_option = id
        self.datetime = datetime
        #self.votes = []
        self.votes = 0

    def vote(self):
        # vote = Vote(user_id)
        # self.votes.append(vote)
        self.votes += 1

    def to_json(self):
        return {
            "id": self.id,
            "datetime": self.datetime,
            "votes": self.votes,
        }


class ClosedEventException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)


class Event(db.Document):
    name = db.StringField(required=True, max_length=100)
    options = db.EmbeddedDocumentListField(EventOption)
    available = db.BooleanField(default=True)
    created_at = db.DateTimeField(default=datetime.datetime.now)

    def __init__(self, name, options, *args, **kwargs):
        super(db.Document, self).__init__(*args, **kwargs)
        self.name = name
        self.options = options
        self.available = True
        self.created_at = datetime.datetime.now()

    def add_option(self, event_option):
        self.options.append(event_option)

    def vote_option(self, option_id):
        if self.available:
            self.options[int(option_id) - 1].vote()  # rever index según db.
        else:
            raise ClosedEventException("Cannot vote in a closed event")

    def close(self):
        self.available = False

    def created_in_the_last_2_hours(self):
        now = datetime.datetime.now()
        hour_diff = round((now - self.created_at).total_seconds() / 3600, 2) 
        return hour_diff <= 2


    def to_json(self):
        option_json = list(map(lambda option: option.to_json(), self.options))
        return {
            'name': self.name,
            'options': option_json,
        }

    meta = {'collection': 'events'}

'''
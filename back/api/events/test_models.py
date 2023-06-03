import pytest
from datetime import datetime, timedelta
from mongoengine import connect
from users.models import User
from events.models import Event, EventOption, Vote, ClosedEventException, OptionNotFoundException, CannotVoteTwiceException


@pytest.fixture
def setup_database():
    # Connect to a test database
    connect('testdb', host='mongomock://localhost')


@pytest.fixture
def create_user():
    # Try to get user
    user = User.objects(username='johndoe').first()
    if(not user):
        user = User(username='johndoe', email='johndoe@example.com', password='password')
        user.save()
    return user


@pytest.fixture
def create_event(create_user):
    event = Event(name='Test Event', creator=create_user)
    event.save()
    return event


@pytest.fixture
def create_event_option(create_event):
    option = EventOption()
    option.save()
    create_event.add_option(option)
    return option


def test_event_creation(create_user):
    event = Event(name='Test Event', creator=create_user)
    event.save()
    assert event.id is not None


def test_event_add_option(create_event, create_event_option):
    event = create_event
    option = create_event_option
    assert option in event.options

import pytest
from flask import json
from app import app
from events.models import Event
from users.models import User
from flask_jwt_extended import create_access_token
import mongomock
from mongoengine import connect, disconnect


@pytest.fixture(scope="function", autouse=True)
def setup_teardown_module():
    disconnect()
    connect('mongoenginetest', host='mongodb://localhost', mongo_client_class=mongomock.MongoClient)
    yield
    disconnect()
    

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


@pytest.fixture
def create_event():
    # Try to get event
    event = Event.objects(name='Test Event').first()
    if not event:
        event = Event(name='Test Event')
        user = User.objects(username='johndoe').first()
        event.creator = user
        event.save()
    return event


@pytest.fixture
def create_user():
    # Try to get user
    user = User.objects(username='johndoe').first()
    if not user:
        user = User(username='johndoe', email='johndoe@example.com', password='password')
        user.save()
    return user


def test_get_events(client, create_user, create_event):
    response = client.get('/events')
    assert response.status_code == 401

    user_token = create_access_token(identity=create_user.username)
    headers = {'Authorization': f'Bearer {user_token}'}
    response = client.get('/events', headers=headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'events' in data
    assert isinstance(data['events'], list)


def test_delete_event(client, create_user, create_event):
    event_id = str(create_event.id)
    response = client.delete(f'/events/{event_id}')
    assert response.status_code == 401

    user_token = create_access_token(identity=create_user.username)
    headers = {'Authorization': f'Bearer {user_token}'}
    response = client.delete(f'/events/{event_id}', headers=headers)
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'message' in data
    assert data['message'] == 'Event deleted'


def test_create_event(client, create_user):
    with app.app_context():
        user_token = create_access_token(identity=create_user.username)
        headers = {'Authorization': f'Bearer {user_token}'}
        data = {'name': 'New Event', 'options': ['2023-06-19T10:12', '2023-06-19T10:13']}
        response = client.post('/events', headers=headers, json=data)
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'message' in data
        assert 'event' in data


def test_add_option(client, create_user, create_event):
    with app.app_context():
        event_id = str(create_event.id)
        user_token = create_access_token(identity=create_user.username)
        headers = {'Authorization': f'Bearer {user_token}'}
        data = {'datetime': '2023-05-30T15:28'}
        response = client.post(f'/events/{event_id}/options', headers=headers, json=data)
        assert response.status_code == 201
        data = json.loads(response.data)
        assert 'message' in data
        assert data['message'] == 'Option added successfully'

def test_count_recent_events(client, create_user):
    with app.app_context():
        user_token = create_access_token(identity=create_user.username)
        headers = {'Authorization': f'Bearer {user_token}'}
        response = client.get('/events-info', headers=headers)
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'events' in data
        assert 'votes' in data


'''
def test_vote_option(client, create_event, create_user):
    with app.app_context():
        event_id = str(create_event.id)
        option_id = str(create_event.options[0].id)
        user_token = create_access_token(identity=create_user.username)
        headers = {'Authorization': f'Bearer {user_token}'}
        response = client.post(f'/events/{event_id}/options/{option_id}/votes', headers=headers)
        assert response.status_code == 40
        data = json.loads(response.data)
        assert 'message' in data
        assert data['message'] == 'Event not found'

'''

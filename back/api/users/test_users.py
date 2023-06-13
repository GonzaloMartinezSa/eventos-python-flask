import json
import pytest
from app import app
from users.models import User
import uuid


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

    try:
        user = User(username="testuser", password="password")
        user.save()
    except Exception as e:
        print('Got this exception:')
        print(e)
        pass


username = 'testuser_' + str(uuid.uuid4())


def test_user_signup(client):
    # Test user signup endpoint

    payload = {
        'username': username,
        'email': username + '@example.com',
        'password': 'password'
    }
    response = client.post('/users/signup', json=payload)
    data = json.loads(response.data)
    assert response.status_code == 201
    assert data['message'] == 'User created successfully'

    # CleanUP
    user = User.objects(username=username).first()
    user.delete()


def test_user_signin(client):
    # Test user signin endpoint
    payload = {
        'username': username,
        'password': 'password'
    }
    response = client.post('/users/signin', json=payload)
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'access_token' in data


def test_user_logout(client):
    # Test user logout endpoint
    access_token = get_access_token(client)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.post('/users/logout', headers=headers)
    data = json.loads(response.data)
    assert response.status_code == 200
    assert data['message'] == 'Logged out successfully'


def get_access_token(client):
    # Helper function to get the access token
    payload = {
        'username': username,
        'password': 'password'
    }
    response = client.post('/users/signin', json=payload)
    data = json.loads(response.data)
    return data['access_token']

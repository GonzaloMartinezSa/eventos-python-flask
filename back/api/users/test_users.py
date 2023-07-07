import json
import pytest
from app import app
from users.models import User
import uuid
from werkzeug.security import generate_password_hash
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
def create_user():
    user = User.objects(username="testuser").first()
    if not user:
        user = User(username="testuser", password=generate_password_hash("password"), email="test@email.com")
        user.save()
    return user

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

    # Cleanup
    user = User.objects(username=username).first()
    user.delete()


def test_user_signin(client, create_user):
    # Test user signin endpoint
    payload = {
        'username': 'testuser',
        'password': 'password',
    }
    response = client.post('/users/signin', json=payload)
    data = json.loads(response.data)

    assert response.status_code == 200
    assert 'access_token' in data

    # Cleanup
    user = User.objects(username="testuser").first()
    user.delete()


def test_user_logout(client, create_user):
    # Test user logout endpoint
    access_token = get_access_token(client)
    headers = {'Authorization': f'Bearer {access_token}'}
    response = client.post('/users/logout', headers=headers)
    data = json.loads(response.data)
    
    assert response.status_code == 200
    assert data['message'] == 'Logged out successfully'

    # Cleanup
    user = User.objects(username="testuser").first()
    user.delete()


def get_access_token(client):
    # Helper function to get the access token
    payload = {
        'username': 'testuser',
        'password': 'password'
    }
    response = client.post('/users/signin', json=payload)
    data = json.loads(response.data)
    return data['access_token']

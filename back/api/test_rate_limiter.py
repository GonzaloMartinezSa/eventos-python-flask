from mongoengine import connect, disconnect
import mongomock
import pytest
from flask import Flask, jsonify
from rate_limiter import limit

@pytest.fixture(scope="function", autouse=True)
def setup_teardown_module():
    disconnect()
    connect('mongoenginetest', host='mongodb://localhost', mongo_client_class=mongomock.MongoClient)
    yield
    disconnect()

app = Flask(__name__)

@app.route("/api/data")
@limit("2/minute")  # Rate limit of 2 requests per minute
def get_data():
    return jsonify({"message": "Data"})

@app.route("/test")
@limit("1/minute") 
def get_data_2():
    return jsonify({"message": "Data"})

@pytest.fixture(scope="function")
def client():
    with app.test_client() as client:
        yield client

def test_rate_limit_not_exceeded(client):
    # Send two requests within the rate limit
    response1 = client.get("/api/data")
    response2 = client.get("/api/data")

    assert response1.status_code == 200
    assert response2.status_code == 200

    # Check response content
    assert response1.json == {"message": "Data"}
    assert response2.json == {"message": "Data"}

def test_rate_limit_exceeded(client):
    # Send three requests, exceeding the rate limit
    response1 = client.get("/api/data")
    response2 = client.get("/api/data")
    response3 = client.get("/api/data")

    assert response1.status_code == 200
    assert response2.status_code == 200
    assert response3.status_code == 429

    # Check response content
    assert response1.json == {"message": "Data"}
    assert response2.json == {"message": "Data"}
    assert response3.json == {'message': 'Excedeed the rate limit for this resource.'}

def test_rate_limit_continious_exceeded(client):
    for i in range(50):
        response = client.get("/api/data")
        if(i < 2):
            assert response.status_code == 200
            assert response.json == {"message": "Data"}
        else:
            assert response.status_code == 429
            assert response.json == {'message': 'Excedeed the rate limit for this resource.'}
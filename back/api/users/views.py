from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    jwt_required,
)
from werkzeug.security import generate_password_hash, check_password_hash
from app import app
from users.models import User
from rate_limiter import limit
import datetime

# User sign up
@app.route('/users/signup', methods=['POST'])
@limit("10/minute")
def sign_up():
    data = request.json
    username = data.get('username', None)
    email = data.get('email', None)
    password = data.get('password', None)

    if not username or not password:
        return jsonify({'message': 'Invalid Payload'}), 400

    # Check if user already exists
    if User.objects(username=username).first() or User.objects(email=email).first():
        return jsonify({'message': 'Username or email already exists'}), 400

    # Create a new user
    user = User(username=username, email=email, password=generate_password_hash(password))
    user.save()

    return jsonify({'message': 'User created successfully'}), 201


# User sign in
@app.route('/users/signin', methods=['POST'])
def sign_in():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    # Find the user in the database
    user = User.objects(username=username).first()

    if user and check_password_hash(user.password, password):
        # Generate an access token
        access_token = create_access_token(identity=user.username, expires_delta = datetime.timedelta(hours = 1))

        return jsonify({'access_token': access_token, 'user': user.to_json()}), 200

    return jsonify({'message': 'Invalid username or password'}), 401


# User log out
@app.route('/users/logout', methods=['POST'])
@jwt_required()
def log_out():
    # Implement any necessary log out logic
    return jsonify({'message': 'Logged out successfully'}), 200
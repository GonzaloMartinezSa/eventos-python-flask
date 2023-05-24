# -*- encoding: utf-8 -*-
"""
Python Aplication Template
Licence: GPLv3
"""

from flask import Flask,jsonify
from flask_bootstrap import Bootstrap
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask import Blueprint
from flask_cors import CORS#, cross_origin
from flask_jwt_extended import JWTManager
import os

app = Flask(__name__)

# Configuration of application, see configuration.py, choose one and uncomment.
# app.config.from_object('configuration.ProductionConfig')
app.config.from_object('app.configuration.DevelopmentConfig')
# app.config.from_object('configuration.TestingConfig')

bs = Bootstrap(app)  # flask-bootstrap

db_username = os.getenv("MONGO_INITDB_ROOT_USERNAME", "root")
db_pass = os.getenv("MONGO_INITDB_ROOT_PASSWORD", "student")
db_name = os.getenv("MONGO_INITDB_DATABASE", "test")

app.config['MONGODB_SETTINGS'] = {
    'db': db_name,
    'host': 'db',
    'port': 27017,
    'username': db_username,
    'password': db_pass
}


app.config['JWT_SECRET_KEY'] = 'dñlsfjgkdslkfjdskjfkldjdslkjfskdlfjdlkjfdklfjdsklfjlkdsfjkldsjdklsjflsflkj'  # Replace with your secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # 24 hours


db = MongoEngine(app)

cors = CORS(app)
jwt = JWTManager(app)

# lm = LoginManager()
# lm.init_app(app)
# lm.login_view = 'login'

from app import views, models
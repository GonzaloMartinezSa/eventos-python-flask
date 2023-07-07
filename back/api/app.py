from flask import Flask
from mongoengine import connect
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from cleaner import start_cleaner
import os

app = Flask(__name__)
cors = CORS(app)

MONGO_HOST = os.environ.get('MONGO_HOST')
MONGO_PORT = int(os.environ.get('MONGO_PORT'))
MONGO_DB = os.environ.get('MONGO_INITDB_DATABASE')
MONGO_USERNAME = os.environ.get('MONGO_INITDB_ROOT_USERNAME')
MONGO_PASSWORD = os.environ.get('MONGO_INITDB_ROOT_PASSWORD')

# Configure Flask JWT Extended
app.config['JWT_SECRET_KEY'] = 'super-secret'
jwt = JWTManager(app)

# Set up the MongoDB connection
connect(
    db=MONGO_DB,
    host=MONGO_HOST,
    port=MONGO_PORT,
    username=MONGO_USERNAME,
    password=MONGO_PASSWORD,
)

from routes import *

if __name__ == "__main__":
    '''
    Execute the app
    '''
    PORT = int(os.environ.get("FLASK_PORT", 5000))
    HOST = os.environ.get("FLASK_HOST", '0.0.0.0')
    DEBUG = bool(int(os.environ.get("DEBUG", 0)))

    start_cleaner()
    
    app.run(host=HOST, port=PORT, debug=DEBUG)

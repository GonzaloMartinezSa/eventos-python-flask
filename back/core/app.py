import os
from app import app

if __name__ == "__main__":
    '''
    Execute the app
    '''

    PORT = int(os.environ.get("FLASK_PORT", 5000))
    HOST = os.environ.get("FLASK_HOST", '0.0.0.0')
    DEBUG = bool(int(os.environ.get("DEBUG", 0)))
    
    app.run(host=HOST, port=PORT, debug=DEBUG)

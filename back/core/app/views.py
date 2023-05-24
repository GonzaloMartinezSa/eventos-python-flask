from app import app #, lm
from app.models import User, Event, EventOption, ClosedEventException, CannntVoteTwiceException
from app import db
from werkzeug.security import generate_password_hash,check_password_hash
from flask_login import login_user,current_user,LoginManager,logout_user,login_required
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity,unset_jwt_cookies, jwt_required
from flask_cors import cross_origin

from flask import jsonify, request
import datetime
from datetime import timezone, timedelta
import json

global_events = []
global_users = []

# Create a Flask-Login instance
login_manager = LoginManager()

login_manager.init_app(app)

@login_manager.user_loader
def load_user(user_id):
    # Load the user from the database using the user ID
    #return User.objects(id=user_id).first()
    users = list(filter(lambda usr: usr.id == int(user_id), global_users))
    if len(users) == 0:
        return None
    else:
        return users[0]

@app.route('/', methods=['GET'])
#@login_required
@jwt_required()
@cross_origin()
def test():

    #cu = current_user

    #return cu.to_json()

    return jsonify({"message": "test passed!"})

'''
body = {
    "username": "Juan",
    "password": "bola2345"
}
'''
@app.route('/signup', methods=['POST', 'GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def signup():

    username = ''
    password = ''

    # Extract user data from the request body
    if request.method == 'POST':
        data = request.get_json()
        username = data['username']
        password = data['password']
    else:
        username = "Mati"
        password = "1234"

    # Hash the password before storing it in the database
    password_hash = generate_password_hash(password)

    # Create a new user instance
    new_user = User(username=username, password=password_hash)

    # Save the user to the database
    #new_user.save()
    global_users.append(new_user)

    # Return a response indicating success
    return jsonify({'message': 'User created successfully!'}), 201


'''
body = {
    "username": "Juan",
    "password": "bola2345"
}
'''
@app.route('/login', methods=['POST', 'GET'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def login():

    username = ''
    password = ''

    # Extract user data from the request body
    if request.method == 'POST':
        data = request.get_json()

        if("username" in data and "password" in data):
            username = data['username']
            password = data['password']
        else:
            return jsonify({'message': 'Invalid payload'}), 400
    else:
        return jsonify({'message': 'Invalid request'}), 400


    # Find the user in the database by username
    #user = User.objects(username=username).first()
    user = list(filter(lambda usr: usr.username == username, global_users))

    # Check if the user exists and the password is correct
    if len(user) != 0 and check_password_hash(user[0].password, password):
        # Log the user in and store their session cookie
        login_user(user[0])

        # Return a response indicating success
        return jsonify({'message': 'Login successful!'}), 200
    else:
        # Return a response indicating authentication failure
        return jsonify({'message': 'Invalid username or password'}), 401
    

# @app.route('/logout', methods=['POST', 'GET'])
# @cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
# #@login_required
# def logout():
#     # Clear the user's session
#     logout_user()
#     return jsonify({'message': 'Logout successful'}), 200

# ------------------ JWT -------------------------------------

app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

@app.route('/token', methods=["POST"])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    
    # Find the user in the database by username
    #user = User.objects(username=username).first()
    user = list(filter(lambda usr: usr.username == username, global_users))

    # Check if the user exists and the password is correct
    if len(user) == 0 or not check_password_hash(user[0].password, password):
        # Return a response indicating authentication failure
        print(len(user))
        return jsonify({'message': 'Invalid username or password'}), 401

    access_token = create_access_token(identity=username)
    response = jsonify({"access_token":access_token, "user_id":user[0].id})
    return response

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.datetime.now(timezone.utc)
        target_timestamp = datetime.datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token 
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response

@app.route("/logout", methods=["POST"])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


#########################################################################

@app.route('/events', methods=['GET'])
#@login_required
@jwt_required()
def get_events():
    #res = jsonify(Event.objects())
    res = jsonify(list(map(lambda event: event.to_json(), global_events)))
    res.status_code = 200
    return res

@app.route('/events/<event_id>', methods=['DELETE'])
#@login_required
def delete_event(event_id):
    events = [event for event in global_events if event.id == int(event_id)]
    if len(events) == 0:
        return jsonify({'message': "event not found"}), 404
    else:
        global_events.remove(events[0])
        return jsonify({'message': "event deleted"}), 200


# Como usuario quiero poder ver los datos de un evento, y los días y horarios
# con su cantidad de votos asociados.

@app.route('/events/<event_id>', methods=['GET'])
@jwt_required()
def get_event(event_id):
    events = [event for event in global_events if event.id == int(event_id)]
    if len(events) == 0:
        return jsonify({'message': "event not found"}), 404
    else:
        return jsonify(events[0].to_json()), 200

# Como usuario quiero crear un evento, estableciendo una serie de opciones.
# Cada opción consta de un día y un horario

'''
body =
{
    "name": "evento_default"
}
'''
@app.route('/events', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@jwt_required()
#@login_required
def create_event():
    data = request.get_json()
    #options_raw = data['options']
    # options = []
    # for option_raw in options_raw:
    #     date_time_str = option_raw['datetime']
    #     date_time = datetime.datetime.strptime(date_time_str, '%d/%m/%Y %H:%M:%S')
    #     option = EventOption(date_time)
    #     options.append(option)
    event = Event(name = data['name'], creator_id=data['creator_id'])
    #event.save()
    global_events.append(event)
    return jsonify({'message': 'event created!'}), 201

'''
body =
{
    "datetime": "18/04/2023 11:00:20"
}
'''
@app.route('/events/<event_id>/options', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@jwt_required()
#@login_required
def add_option(event_id):
    req = request.get_json()
    #event = Event.objects(pk=event_id).to_json() # no va
    date_time = datetime.datetime.strptime(req['datetime'], '%Y-%m-%dT%H:%M')
    option = EventOption(datetime = date_time)
    event = [evento for evento in global_events if evento.id == int(event_id)][0]
    event.add_option(option)
    #event.save()
    return jsonify({'message': 'option created!'}), 201



# Como usuario quiero anotarme a un evento ya creado, pudiendo votar todos
# los días y horarios que me quedan bien.

# podria ser a /votes/ y pasarle los datos de el evento y la opcion por el body
'''
no body
'''
@app.route('/events/<event_id>/options/<option_id>/votes', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@jwt_required()
#@login_required
def vote_option(event_id, option_id):
    try:
        req = request.get_json()
        voter_id = req['voter_id']
        event = [event for event in global_events if event.id == int(event_id)][0]
        event.vote_option(option_id, voter_id)
        res = jsonify({'message':'option voted!'}), 200
    except IndexError:
        res = jsonify({'message':f'No event with id = {event_id}'}), 404
    except ClosedEventException:
        res = jsonify({'message':'Cannot vote in closed event'}), 400
    except CannntVoteTwiceException:
        res = jsonify({'message':'Cannot vote twice'}), 400

    return res


# Como usuario quiero poder cerrar la votación de un evento. Siempre y cuando
# haya sido creado por mi.
'''
no body
'''
@app.route('/events/<event_id>/close', methods=['POST'])
@cross_origin(origin='*', headers=['Content-Type', 'Authorization'])
@jwt_required()
#@login_required
def close_event(event_id):

    try:
        [event.close() for event in global_events if event.id == int(event_id)]
        res = jsonify({'message':'event closed!'}), 200
    except ClosedEventException:
        res = jsonify({'message':'Cannot close an event with no options'}), 400
    return res


# A fines de monitoreo (y marketing) se solicita ver un contador con la cantidad
# de eventos creados y horarios votados anotados en las últimas 2 horas. Este
# dato debe ser tan preciso como sea posible.

@app.route('/events-info', methods=['GET'])
@jwt_required()
def count_recent_events():
    event_count = len(global_events)
    vote_sum = 0
    for event in filter(lambda event: event.created_in_the_last_2_hours(), global_events) :
        vote_sum += sum(map(lambda option: option.total_votes(), event.options))
    return jsonify({'events': event_count, 'votes': vote_sum})

# 2 rutas mas que se podrian anadir serian para:
# - en un evento, remover una de las opciones
# - en una opcion de un evento, remover un voto

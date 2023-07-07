from flask import jsonify, request
from app import app
from events.models import Event, EventOption, Vote, ClosedEventException
from users.models import User
from rate_limiter import limit
from flask_jwt_extended import jwt_required,get_jwt_identity
from datetime import datetime, timedelta
from blacklist import check_blacklist

# Get all events
@app.route('/events', methods=['GET'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def get_events():
    events = Event.objects()
    return jsonify({'events': [(lambda y: y.to_json())(x) for x in events]}), 200

# Delete an event
@app.route('/events/<event_id>', methods=['DELETE'])
@jwt_required()
@limit("10/minute")
@check_blacklist()
def delete_event(event_id):
    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    event.delete()
    return jsonify({'message': 'Event deleted'}), 200

# Get a specific event
@app.route('/events/<event_id>', methods=['GET'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def get_event(event_id):
    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    return jsonify(event.to_json()), 200


# Votes from specific event for current user
@app.route('/events/<event_id>/available', methods=['GET'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def get_event_myvotes(event_id):
    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404
    
    creator = get_jwt_identity()
    user = User.objects(username = creator).first()

    return jsonify(event.to_json_voted(user)), 200


# Create an event
@app.route('/events', methods=['POST'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def create_event():
    data = request.json
    name = data.get('name', None)
    options = data.get('options', None)

    if(not name):
        return jsonify({"message": "Invalid payload"}), 400 
    if(not options):
        return jsonify({'mesage': 'No options'}), 400

    creator = get_jwt_identity()
    creator = User.objects(username = creator).first()

    event = Event(name=name, creator=creator)
    event.save()

    for option in options:
        date_time = datetime.strptime(option, '%Y-%m-%dT%H:%M')
        event_option = EventOption(timestamp=date_time)
        event_option.save()
        event.options.append(event_option)
    event.save()
  
    
    return jsonify({'message': 'Event created successfully!', 'event': event.to_json()}), 201

# Add an option to an event
@app.route('/events/<event_id>/options', methods=['POST'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def add_option(event_id):
    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    data = request.json
    date_time = data.get('datetime', None)

    if(not date_time):
        return jsonify({'mesage': 'No datetime'}), 400
    
    date_time = datetime.strptime(date_time, '%Y-%m-%dT%H:%M')
    print(date_time)
    event_option = EventOption(timestamp=date_time)
    event_option.save()
    event.options.append(event_option)
    event.save()
    return jsonify({'message': 'Option added successfully', 'event': event.to_json()}), 201

# Vote an option
@app.route('/events/<event_id>/options/votes', methods=['POST'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def vote_option(event_id):

    event = Event.objects(id=event_id).first()
    if not event:
        return jsonify({'message': 'Event not found'}), 404

    data = request.json
    option_ids = data.get('option_ids', [])

    creator = get_jwt_identity()
    creator = User.objects(username = creator).first()

    try:
        for option in option_ids:
            event.vote_option(option, creator)
        
        return jsonify({'message': 'Voted successfully!', 'event': event.to_json()}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
# Close an event
@app.route('/events/<event_id>/close', methods=['POST'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def close_event(event_id):
    # Get the event
    try:
        event = Event.objects.get(id=event_id)
    except:
        return jsonify({"message": "Event does not exists!"}), 404
    
    user = get_jwt_identity()
    user = User.objects(username = user).first()

    # Check permissions
    if(event.creator != user):
        return jsonify({"message": "You dont have permission for this events!"}), 401

    # If the event already closed??
    if(not event.available):
        return jsonify({"message": "Event already closed!"}), 400
    
    # Close the event
    try:
        event.close()
        return jsonify({'message': 'Event closed successfully', 'event':event.to_json()}), 200
    except ClosedEventException:
        return jsonify({'message': 'Cannot close an event with no options'}), 400

# Info on the events created and votes performed in the last 2 hours
@app.route('/events-info', methods=['GET'])
@jwt_required()
@limit("100/minute")
@check_blacklist()
def count_recent_events():
    recent_events_total = Event.objects(created_at__gte=datetime.now() - timedelta(hours=2)).count()
    recent_votes_total = Vote.objects(timestamp__gte=datetime.now() - timedelta(hours=2)).count()
    recent_votes = Vote.objects(timestamp__gte=datetime.now() - timedelta(hours=2))
    recent_voted_options_raw = [EventOption.objects(votes__in=[vote.id]).first() for vote in recent_votes ]
    recent_voted_options = [event_option.to_json()['datetime'] for event_option in recent_voted_options_raw if event_option]
    recent_voted_events_raw = [Event.objects(options__in=[option.id]).first() for option in recent_voted_options_raw ]
    recent_voted_events = [event.to_json()['name'] for event in recent_voted_events_raw if event]
    votes_info = [f'{recent_voted_events[index]}: {vote}' for index,vote in enumerate(recent_voted_options)]

    # Este codigo es una mierda literal. Antes devolvia 'recent_voted_options' y listo
    # pero para devolverlo con el nombre del evento hice eso, que es una mierda gigante
    # pero funciona

    return jsonify({
            'events': recent_events_total,
            'votes': recent_votes_total,
            'votes_info': votes_info,
        }), 200

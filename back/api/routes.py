from app import app

from users.views import sign_up, sign_in, log_out


from events.views import (
    get_events,
    delete_event,
    get_event,
    create_event,
    add_option,
    vote_option,
    close_event,
    count_recent_events,
    )

# User sign up
app.add_url_rule('/users/signup', view_func=sign_up, methods=['POST'])
# User sign in
app.add_url_rule('/users/signin', view_func=sign_in, methods=['POST'])
# User log out
app.add_url_rule('/users/logout', view_func=log_out, methods=['POST', 'GET'])

# Get all eventsevent_json["created_timestamp"] = ts
app.add_url_rule('/events', view_func=get_events, methods=['GET'])
# Delete an event
app.add_url_rule('/events/<event_id>', view_func=delete_event, methods=['DELETE'])
# Get a specific event
app.add_url_rule('/events/<event_id>', view_func=get_event, methods=['GET'])
# Create an event
app.add_url_rule('/events', view_func=create_event, methods=['POST'])
# Add an option to an event
app.add_url_rule('/events/<event_id>/options', view_func=add_option, methods=['POST'])
# Vote an option
app.add_url_rule('/events/<event_id>/options/<option_id>/votes', view_func=vote_option, methods=['POST'])


app.add_url_rule('/events/<event_id>/close', view_func=close_event, methods=['POST'])
# Vote an option
app.add_url_rule('/events/info', view_func=count_recent_events, methods=['GET'])
from datetime import datetime
import json

from flask.json import jsonify
import app.models as models
import app.views as views
from app import app

def test_get_events_returns_all_events():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        views.global_events.append(models.Event("event 2", [
            models.EventOption(datetime(2023, 5, 20)),
            models.EventOption(datetime(2023, 5, 21))
        ]))
        res = c.get("/events")
        assert res.status_code == 200
        assert b"event 1" in res.data
        assert b"event 2" in res.data
        views.global_events = []
        models.id_counter = 0
        

def test_delete_event_removes_it_from_the_list():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        res = c.delete("/events/1")
        assert res.status_code == 200
        assert views.global_events == []
        views.global_events = []
        models.id_counter = 0

def test_delete_event_returns_not_found_if_it_does_not_exist():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        views.global_events.append(models.Event("event 2"))
        res = c.delete("/events/5")
        assert res.status_code == 404
        assert len(views.global_events) == 2
        views.global_events = []
        models.id_counter = 0

def test_get_event_returns_one_event():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        views.global_events.append(models.Event("event 2"))
        res = c.get("/events/1")
        assert res.status_code == 200
        assert b"event 1" in res.data
        views.global_events = []
        models.id_counter = 0

def test_get_event_returns_not_found_if_it_does_not_exist():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        views.global_events.append(models.Event("event 2"))
        res = c.get("/events/15")
        assert res.status_code == 404
        views.global_events = []
        models.id_counter = 0

def test_create_event_adds_an_event_to_the_list():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        res = c.post("/events",
                     headers = {'Content-Type': 'application/json'},
                     data = json.dumps({"name": "event 1"}))
        assert res.status_code == 201
        assert views.global_events[0].name == "event 1"
        assert views.global_events[0].id == 1
        views.global_events = []
        models.id_counter = 0

def test_add_option_adds_an_option_to_given_event():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1"))
        res = c.post("/events/1/options",
                     headers = {'Content-Type': 'application/json'},
                     data = json.dumps({"datetime": "20/05/2023 12:00:00"}))
        assert res.status_code == 201
        assert views.global_events[0].options[0].date_time == datetime(2023, 5, 20, 12)
        views.global_events = []
        models.id_counter = 0

def test_vote_option_adds_a_vote_to_given_event_and_option():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1", [models.EventOption(datetime(2023, 5, 12))]))
        res = c.post("/events/2/options/1/votes")
        assert res.status_code == 200
        assert views.global_events[0].options[0].total_votes() == 1
        views.global_events = []
        models.id_counter = 0

def test_vote_option_in_closed_event_does_not_change_the_option():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1", [models.EventOption(datetime(2023, 5, 12))]))
        views.global_events[0].close()
        res = c.post("/events/2/options/1/votes")
        assert res.status_code == 400
        assert views.global_events[0].options[0].total_votes() == 0
        views.global_events = []
        models.id_counter = 0

def test_close_event_sets_final_date():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1", [models.EventOption(datetime(2023, 5, 12))]))
        views.global_events[0].vote_option(1)
        res = c.post("/events/2/close")
        assert res.status_code == 200
        assert views.global_events[0].final_date == datetime(2023, 5, 12)
        views.global_events = []
        models.id_counter = 0
    
def test_count_recent_events_returns_how_many_events_and_votes_there_were_recently():
    with app.app_context():
        c = app.test_client()
        app.config["LOGIN_DISABLED"] = True
        views.global_events.append(models.Event("event 1", [models.EventOption(datetime(2023, 5, 12))]))
        views.global_events[0].vote_option(1)
        views.global_events[0].vote_option(1)
        res = c.get("/events-info")
        assert res.status_code == 200
        assert b"\"events\": 1" in res.data
        assert b"\"votes\": 2" in res.data
        views.global_events = []
        models.id_counter = 0
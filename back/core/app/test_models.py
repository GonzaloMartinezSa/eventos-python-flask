from datetime import datetime

import pytest
import app.models
from app.models import Event, EventOption, ClosedEventException

def test_adding_an_option_adds_it_to_options_list():
    event = Event("sample event")
    event.add_option(EventOption(datetime(2023, 5, 20)))
    assert len(event.options) == 1
    app.models.id_counter = 0

def test_voting_an_option_in_an_open_event_adds_a_vote_to_that_option():
    event = Event("sample event")
    event.add_option(EventOption(datetime(2023, 5, 20)))
    event.vote_option(2)
    assert event.options[0].date_time == datetime(2023, 5, 20)
    assert event.options[0].id_option == 2
    app.models.id_counter = 0

def test_voting_an_option_in_a_closed_event_raises_an_exception():
    event = Event("sample event")
    event.add_option(EventOption(datetime(2023, 5, 20)))
    event.vote_option(2)
    event.close()
    with pytest.raises(ClosedEventException):
        event.vote_option(2)
    app.models.id_counter = 0

def test_closing_an_event_sets_the_date_to_the_winning_option():
    event = Event("sample event")
    event.add_option(EventOption(datetime(2023, 5, 20)))
    event.add_option(EventOption(datetime(2023, 5, 21)))
    for option in event.options:
        print(option.id_option)
    event.vote_option(3)
    event.vote_option(2)
    event.vote_option(3)
    event.close()
    assert event.final_date == datetime(2023, 5, 21)
    app.models.id_counter = 0

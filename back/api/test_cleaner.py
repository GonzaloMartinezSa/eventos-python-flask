from rate_limiter import Measurement
from datetime import datetime, timedelta
from cleaner import cleanup_old_documents
import mongomock
from mongoengine import connect, disconnect
import pytest

@pytest.fixture(scope="function", autouse=True)
def setup_teardown_module():
    disconnect()
    connect('mongoenginetest', host='mongodb://localhost', mongo_client_class=mongomock.MongoClient)
    yield
    disconnect()

def test_simple_cleaning():
    Measurement(method="GET", route="/api/data", time = datetime.now() - timedelta(hours=24)).save()
    assert Measurement.objects().count() == 1
    cleanup_old_documents()
    assert Measurement.objects().count() == 0
    
def test_timing_of_cleaning():
    Measurement(method="GET", route="/api/data", time = datetime.now() - timedelta(hours=24)).save()
    Measurement(method="GET", route="/api/data", time = datetime.now()).save()
    assert Measurement.objects().count() == 2
    cleanup_old_documents()
    assert Measurement.objects().count() == 1

def test_cleaning_nothing():
    cleanup_old_documents()
    assert True
    Measurement(method="GET", route="/api/data", time = datetime.now()).save()
    cleanup_old_documents()
    assert Measurement.objects().count() == 1
    


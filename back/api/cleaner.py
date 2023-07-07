
from apscheduler.schedulers.background import BackgroundScheduler
from mongoengine.connection import connect
from datetime import datetime, timedelta
from rate_limiter import Measurement

def cleanup_old_documents():
    cutoff_date = datetime.now() - timedelta(minutes=20)
    print(f"Borrando reigstros del ratelimiter viejos.. {cutoff_date}")
    Measurement.objects(time__lte=cutoff_date).delete()

# Start the scheduler
def start_cleaner():
    # Create a scheduler
    scheduler = BackgroundScheduler()
    # Add the cleanup job to run every 1 minute
    scheduler.add_job(cleanup_old_documents, 'interval', minutes=20)
    scheduler.start()
    print("Scheduler started..")

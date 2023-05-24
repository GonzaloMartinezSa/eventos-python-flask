from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

class Vote(models.Model):

    option = models.ForeignKey('EventOption', on_delete=models.CASCADE, related_name='votes')
    timestamp = models.DateTimeField(default=timezone.now)

    #user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='votes')

    def __str__(self):
        return f"Vote #{self.id} for {self.option} at {self.voted_at}"
    
class EventOption(models.Model):
    date_time = models.DateTimeField()
    event = models.ForeignKey('Event', on_delete=models.CASCADE, related_name='options')

    def vote(self):
        Vote.objects.create(option=self)

    def total_votes(self):
        return self.votes.count()

class ClosedEventException(Exception):
    def __init__(self, *args: object) -> None:
        super().__init__(*args)

class Event(models.Model):
    name = models.CharField(max_length=255)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(default=timezone.now)
    final_date = models.DateTimeField(null=True, blank=True)

    def add_option(self, date_time):
        EventOption.objects.create(date_time=date_time, event=self)

    def vote_option(self, option_id):
        if not self.available:
            raise ClosedEventException("Cannot vote in a closed event")
        try:
            option = self.options.get(id=option_id)
            option.vote()
        except EventOption.DoesNotExist:
            raise ValueError("Invalid option ID")

    def close(self):
        self.available = False
        if self.options.count() == 0:
            raise ClosedEventException("no hay opciones")
        
        winner = max(self.options.all(), default=None, key=lambda option: option.total_votes())
        self.final_date = winner.date_time
        self.save()

    def created_in_the_last_2_hours(self):
        now = timezone.now()
        hour_diff = round((now - self.created_at).total_seconds() / 3600, 2) 
        return hour_diff <= 2

from functools import wraps
from flask import request, jsonify
from mongoengine import Document, DateTimeField, StringField
from datetime import datetime, timedelta

class Measurement(Document):
    method = StringField(required=True)
    route = StringField(required=True)
    time = DateTimeField(required=True, default=datetime.now)


def limit(param: str = "20/minute"):
    def decorator(route_func):
        @wraps(route_func)
        def wrapper(*args, **kwargs):

            # Code to execute before the route function is called
            print("Executing custom decorator with parameter:", param)
            print("For url path:", request.path)
            print("With HTTP method:", request.method)

            # param                                     # '10/minute', '10/hour, '10/day'
            rate_value = int(param.split('/')[0])       # '10'
            rate_unit = param.split('/')[1]             # 'minute'
            path = request.path                         # '/events'
            method = request.method                     # 'GET'

            # interpreto el rango de tiempo a limitar
            current_time = datetime.now()
            start_time = None
            end_time = None
            if rate_unit == 'minute':
                start_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day,
                                      hour=current_time.hour, minute=current_time.minute, second=0)
                end_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day,
                                    hour=current_time.hour, minute=current_time.minute, second=59)
            elif rate_unit == 'hour':
                start_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day,
                                      hour=current_time.hour, minute=0, second=0)
                end_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day,
                                    hour=current_time.hour, minute=59, second=59)
            elif rate_unit == 'day':
                start_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day, hour=0,
                                      minute=0, second=0)
                end_time = datetime(year=current_time.year, month=current_time.month, day=current_time.day, hour=23,
                                    minute=59, second=59)
            else:
                raise ValueError("Wrong value for the rate limit. Only accept 'minute', 'hour', 'day'")
            measurement_total = Measurement.objects(time__gte=start_time, time__lte=end_time).count()

            # chequeo si esta request cumple con el rate limiter (el -1 por el actual que no esta guardado todavia)
            cumple_rate_limiter = measurement_total <= rate_value - 1

            if cumple_rate_limiter:
                # guardo la info del request
                measurement = Measurement(method=method, route=path)
                measurement.save()
                # Call the route function
                result = route_func(*args, **kwargs)
            else:
                result = jsonify({'message': 'Excedeed the rate limit for this resource.'}), 429

            # Code to execute after the route function is called
            # (if needed)

            return result

        return wrapper

    return decorator

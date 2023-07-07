from functools import wraps
from flask import request, jsonify

blacklist = []

def check_blacklist():
    def decorator(route_func):
        @wraps(route_func)
        def wrapper(*args, **kwargs):
            token = request.headers["Authorization"][7:]
            print(blacklist)
            if token in blacklist:
                result = jsonify({'message': 'Token blacklisted.'}, 403)
            else:
                result = route_func(*args, **kwargs)
            return result
        return wrapper
    return decorator

def add_to_blacklist():
    def decorator(route_func):
        @wraps(route_func)
        def wrapper(*args, **kwargs):
            token = request.headers["Authorization"][7:]
            blacklist.append(token)
            return route_func(*args, **kwargs)
        return wrapper
    return decorator
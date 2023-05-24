from django.shortcuts import render
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authtoken.models import Token
from django.http import JsonResponse
import json

@csrf_exempt
def signup(request):
    if request.method == 'POST':

        data = json.loads(request.body)
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not (username and email and password):
            return JsonResponse({'error': 'Please provide a username, email, and password.'}, status=400)
        try:
            user = User.objects.create_user(username, email, password)
            token, created = Token.objects.get_or_create(user=user)
            return JsonResponse({'token': token.key}, status=201)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method.'}, status=400)
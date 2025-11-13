import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse

@csrf_exempt
def register_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    
    try:
        data = json.loads(request.body)
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
    except Exception:
        return JsonResponse({"error": "Invalid Json"}, status=400)
    
    if not username or not email or not password:
        return JsonResponse({"error": "missing fields"}, status=400)
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({"error": "user name already exists"}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    login(request, user)
    return JsonResponse({
        "success": True,
        "message": "Registration succsesful",
        "user": {"id": user.id, "username": user.username, "email": user.email}}, status=201)

    
@csrf_exempt
def login_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    
    try:
        data = json.loads(request.body)
        username_or_email = data.get("email") or data.get("username")
        password = data.get("password")
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    
    if not username_or_email or not password:
        return JsonResponse({"error": "Missing credentials"}, status=400)
    
    try:
        user_obj = User.objects.get(email=username_or_email)
        username = user_obj.username
    except User.DoesNotExist:
        username = username_or_email

    user = authenticate(request, username=username, password=password)
    if user is None:
        return JsonResponse({"error": "Invalid credentials"}, status=401)
    
    login(request, user)
    return JsonResponse({
        "success": True,
        "message": "Login successful",
        "user": {"id": user.id, "username": user.username, "email": user.email}
    })
    
def logout_api(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)
    logout(request)
    return JsonResponse({"success": True, "message": "Logged out"})

@login_required
def user_info(request):
    profile = request.user.profile
    return JsonResponse({
        "username": request.user.username,
        "email": request.user.email,
        "avatar": profile.avatar.url if profile.avatar else "/media/avatars/default.png"
    })

@csrf_exempt
@login_required
def update_avatar(request):
    if request.method == "POST" and request.FILES.get("avatar"):
        profile = request.user.profile
        profile.avatar = request.files["avatar"]
        profile.save()
        return JsonResponse({"success": True, "avatar": profile.avatar.url})
    return JsonResponse({"error": "invalid request"}, status=400)
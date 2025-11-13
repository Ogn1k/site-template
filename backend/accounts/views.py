import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib import messages
from .models import CartItem

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
@require_POST
def update_avatar(request):
    if request.method == "POST" and request.FILES.get("avatar"):
        profile = request.user.profile
        profile.avatar = request.files["avatar"]
        profile.save()
        return JsonResponse({"success": True, "avatar": profile.avatar.url})
    return JsonResponse({"error": "invalid request"}, status=400)

@login_required
def get_cart(request):
    items = CartItem.objects.filter(user=request.user)
    return JsonResponse({"cart": [
        {
            "id": i.id, 
            "product_id": i.product_id,
            "name": i.product_name, 
            "price": i.price, 
            "quantity": i.quantity
        }
        for i in items
    ]
    return JsonResponse({"cart": data})})

def sync_cart(request):
    try:
        data = json.loads(request.body)
        cart_items = data.get("cart", [])
        for item in cart_items:
            obj, created = CartItem.objects.update_or_create(
                user=request.user,
                product_id=item["product_id"],
                defaults={
                    "name": item["name"],
                    "price": item["price"],
                    "quantity": item.get("quantity", 1),
                },
            )
        return JsonResponse({"success": True})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@login_required
def add_to_cart(request):
    data = json.loads(request.body)
    item = CartItem.objects.create(
        user=request.user,
        product_name=data["name"],
        price=data["price"],
        quantity=data.get("quantity", 1)
    )
    return JsonResponse({"success": True, "item_id": item.id})

@require_POST
@login_required
def remove_from_cart(request):
    try:
        data = json.loads(request.body)
        product_id = data.get("product_id")

        if not product_id:
            return JsonResponse({"error": "product_id is required"}, status=400)
        
        deleted, _ = CartItem.objects.filter(
            user=request.user, product_id=product_id
        ).delete()

        if deleted:
            return JsonResponse({"success": True, "removed": product_id})
        else:
            return JsonResponse({"success": False, "message": "Item not found"}),
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
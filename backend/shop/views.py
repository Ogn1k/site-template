from django.shortcuts import render
from django.http import JsonResponse
from .models import Product

# Create your views here.
def get_products(request):
    products = Product.objects.filter(in_stock=True)
    data = 
    [
        {
            "id": p.id,
            "name": p.name,
            "description": p.description,
            "price": float(p.price),
            "image": p.image.url if p.image else None,
            "category": p.category
        }
        for p in products
    ]
    return JsonResponse({"products": data})
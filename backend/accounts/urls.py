from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.register_api, name="api_register"),
    path("login/", views.login_api, name="api_login"),
    path("logout/", views.logout_api, name="api_logout"),
    path("user/", views.user_info, name="user_info"),
    path("cart/", views.get_cart, name="get_cart"),
    path("cart/sync/", views.sync_cart, name="sync_cart"),
    path("cart/remove/", views.remove_from_cart, name="remove_from_cart"),
    path("cart/add/", views.add_to_cart, name="add_to_cart"),
]

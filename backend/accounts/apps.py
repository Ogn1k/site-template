from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    default_app_config = 'accounts.apps.AccountsConfig'
    name = 'accounts'

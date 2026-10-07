from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path
from chat import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.chat_home, name="home"),
    path("login/", auth_views.LoginView.as_view(template_name="login.html"), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path("register/", views.register, name="register"),
    path("api/users/", views.users_api, name="users_api"),
    path("api/messages/<int:user_id>/", views.messages_api, name="messages_api"),
]

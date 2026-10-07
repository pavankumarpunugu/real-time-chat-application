from django.contrib.auth import authenticate, login
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.shortcuts import redirect, render
from .models import Message

def register(request):
    if request.method == "POST":
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        if not username or len(password) < 6:
            return render(request, "register.html", {"error": "Username is required and password must be at least 6 characters."})
        if User.objects.filter(username=username).exists():
            return render(request, "register.html", {"error": "Username already exists."})
        user = User.objects.create_user(username=username, password=password)
        login(request, user)
        return redirect("home")
    return render(request, "register.html")

@login_required
def chat_home(request):
    return render(request, "chat.html", {"current_user": request.user})

@login_required
def users_api(request):
    users = User.objects.exclude(id=request.user.id).order_by("username")
    return JsonResponse({"users": [{"id": u.id, "username": u.username} for u in users]})

@login_required
def messages_api(request, user_id):
    other = User.objects.get(id=user_id)
    qs = Message.objects.filter(
        sender__in=[request.user, other],
        receiver__in=[request.user, other],
    ).select_related("sender")
    data = [{
        "id": m.id,
        "sender_id": m.sender_id,
        "sender": m.sender.username,
        "content": m.content,
        "timestamp": m.timestamp.strftime("%H:%M"),
    } for m in qs]
    return JsonResponse({"messages": data})

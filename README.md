# Real-Time Chat Application

A beginner-friendly real-time chat application built with Python, Django, Django Channels, WebSockets, HTML, CSS, and JavaScript.

## Features
- User registration and login
- Real-time one-to-one chat using WebSockets
- Online users list
- Persistent chat messages in SQLite
- Responsive HTML/CSS/JavaScript interface
- Django authentication
- REST-style JSON endpoints for users and message history

## Run locally

```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open:
`http://127.0.0.1:8000/`

Create two accounts in two browser windows/tabs and log in with different users to test real-time messaging.

## Technologies
Python, Django, Django Channels, WebSockets, JavaScript, HTML, CSS, SQLite

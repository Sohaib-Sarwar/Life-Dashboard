from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from models import db


class User(db.Model):
    """User model for authentication and profile management"""

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(50))
    last_name = db.Column(db.String(50))
    age = db.Column(db.Integer, nullable=True)
    budget = db.Column(db.Float, default=5000.0)
    theme_preference = db.Column(db.String(20), default="dark")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Login streak tracking
    current_streak = db.Column(db.Integer, default=0)
    longest_streak = db.Column(db.Integer, default=0)
    last_login = db.Column(db.Date, nullable=True)

    # Relationships
    tasks = db.relationship(
        "Task", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    habits = db.relationship(
        "Habit", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    expenses = db.relationship(
        "Expense", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    journal_entries = db.relationship(
        "JournalEntry", backref="user", lazy=True, cascade="all, delete-orphan"
    )
    calendar_events = db.relationship(
        "CalendarEvent", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "email": self.email,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "age": self.age,
            "budget": self.budget,
            "theme_preference": self.theme_preference,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "current_streak": self.current_streak,
            "longest_streak": self.longest_streak,
            "last_login": self.last_login.isoformat() if self.last_login else None,
        }

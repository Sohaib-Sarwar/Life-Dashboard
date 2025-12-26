from datetime import datetime
from models import db


class Habit(db.Model):
    """Habit model for tracking daily/weekly habits"""

    __tablename__ = "habits"

    FREQUENCY_OPTIONS = ["daily", "weekly", "weekdays", "weekends"]
    DEFAULT_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"]

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    frequency = db.Column(db.String(20), default="daily")  # daily, weekly
    target_days = db.Column(db.Integer, default=7)
    color = db.Column(db.String(20), default="#3B82F6")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    logs = db.relationship(
        "HabitLog", backref="habit", lazy=True, cascade="all, delete-orphan"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "frequency": self.frequency,
            "target_days": self.target_days,
            "color": self.color,
            "logs": [log.to_dict() for log in self.logs] if self.logs else [],
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class HabitLog(db.Model):
    __tablename__ = "habit_logs"

    id = db.Column(db.Integer, primary_key=True)
    habit_id = db.Column(db.Integer, db.ForeignKey("habits.id"), nullable=False)
    date = db.Column(db.Date, nullable=False)
    completed = db.Column(db.Boolean, default=True)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    __table_args__ = (
        db.UniqueConstraint("habit_id", "date", name="unique_habit_date"),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "habit_id": self.habit_id,
            "date": self.date.isoformat() if self.date else None,
            "completed": self.completed,
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

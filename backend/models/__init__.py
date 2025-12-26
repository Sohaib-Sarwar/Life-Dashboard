from flask_sqlalchemy import SQLAlchemy

# Initialize db here to avoid circular imports
db = SQLAlchemy()

from .user import User
from .task import Task
from .habit import Habit, HabitLog
from .expense import Expense
from .journal import JournalEntry
from .calendar import CalendarEvent

__all__ = ['db', 'User', 'Task', 'Habit', 'HabitLog', 'Expense', 'JournalEntry', 'CalendarEvent']

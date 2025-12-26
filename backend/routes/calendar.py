from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Task, Habit, HabitLog, CalendarEvent, db
from datetime import datetime, date, timedelta

calendar_bp = Blueprint('calendar', __name__)


@calendar_bp.route('', methods=['GET'])
@jwt_required()
def get_calendar():
    """Get calendar events for a month"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get month and year from query params
        year = int(request.args.get('year', date.today().year))
        month = int(request.args.get('month', date.today().month))
        
        # Calculate start and end dates for the month
        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = date(year, month + 1, 1) - timedelta(days=1)
        
        # Get calendar events
        events = CalendarEvent.query.filter(
            CalendarEvent.user_id == user_id,
            CalendarEvent.start_time >= datetime.combine(start_date, datetime.min.time()),
            CalendarEvent.start_time <= datetime.combine(end_date, datetime.max.time())
        ).all()
        
        return jsonify([event.to_dict() for event in events]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendar_bp.route('', methods=['POST'])
@jwt_required()
def create_calendar_event():
    """Create a new calendar event"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data.get('title') or not data.get('start_time') or not data.get('end_time'):
            return jsonify({'error': 'Title, start_time, and end_time are required'}), 400
        
        event = CalendarEvent(
            user_id=user_id,
            title=data['title'],
            description=data.get('description'),
            start_time=datetime.fromisoformat(data['start_time']),
            end_time=datetime.fromisoformat(data['end_time']),
            event_type=data.get('event_type', 'personal'),
            location=data.get('location'),
            priority=data.get('priority', 'medium'),
            color=data.get('color', '#1a1a1a'),
            reminder=data.get('reminder', False)
        )
        
        db.session.add(event)
        db.session.commit()
        
        return jsonify({
            'message': 'Event created successfully',
            'event': event.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@calendar_bp.route('/events', methods=['GET'])
@jwt_required()
def get_calendar_events():
    """Get all calendar events (tasks and habits) for a date range"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get date range from query params
        start_date_str = request.args.get('start_date')
        end_date_str = request.args.get('end_date')
        
        if not start_date_str or not end_date_str:
            return jsonify({'error': 'start_date and end_date are required'}), 400
        
        start_date = datetime.fromisoformat(start_date_str).date()
        end_date = datetime.fromisoformat(end_date_str).date()
        
        # Get tasks within date range
        tasks = Task.query.filter(
            Task.user_id == user_id,
            Task.due_date >= start_date,
            Task.due_date <= end_date
        ).all()
        
        # Get habits
        habits = Habit.query.filter_by(user_id=user_id).all()
        
        # Get habit logs within date range
        habit_logs = HabitLog.query.join(Habit).filter(
            Habit.user_id == user_id,
            HabitLog.date >= start_date,
            HabitLog.date <= end_date
        ).all()
        
        # Format events
        events = []
        
        # Add tasks as events
        for task in tasks:
            events.append({
                'id': f'task-{task.id}',
                'type': 'task',
                'title': task.title,
                'description': task.description,
                'date': task.due_date.isoformat() if task.due_date else None,
                'priority': task.priority,
                'status': task.status,
                'color': get_priority_color(task.priority)
            })
        
        # Add habit logs as events
        for log in habit_logs:
            habit = log.habit
            events.append({
                'id': f'habit-{log.id}',
                'type': 'habit',
                'title': habit.name,
                'description': habit.description,
                'date': log.date.isoformat() if log.date else None,
                'completed': log.completed,
                'color': habit.color
            })
        
        return jsonify(events), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendar_bp.route('/month', methods=['GET'])
@jwt_required()
def get_month_view():
    """Get calendar view for a specific month"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get month and year from query params
        year = int(request.args.get('year', date.today().year))
        month = int(request.args.get('month', date.today().month))
        
        # Calculate start and end dates for the month
        start_date = date(year, month, 1)
        if month == 12:
            end_date = date(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = date(year, month + 1, 1) - timedelta(days=1)
        
        # Get tasks for the month
        tasks = Task.query.filter(
            Task.user_id == user_id,
            Task.due_date >= start_date,
            Task.due_date <= end_date
        ).all()
        
        # Get habits for the month
        habits = Habit.query.filter_by(user_id=user_id).all()
        
        # Get habit logs for the month
        habit_logs = HabitLog.query.join(Habit).filter(
            Habit.user_id == user_id,
            HabitLog.date >= start_date,
            HabitLog.date <= end_date
        ).all()
        
        # Build day-by-day calendar
        calendar_data = {}
        current_date = start_date
        
        while current_date <= end_date:
            date_str = current_date.isoformat()
            calendar_data[date_str] = {
                'date': date_str,
                'tasks': [],
                'habits': []
            }
            current_date += timedelta(days=1)
        
        # Add tasks to calendar
        for task in tasks:
            if task.due_date:
                date_str = task.due_date.isoformat()
                if date_str in calendar_data:
                    calendar_data[date_str]['tasks'].append({
                        'id': task.id,
                        'title': task.title,
                        'priority': task.priority,
                        'status': task.status
                    })
        
        # Add habit logs to calendar
        for log in habit_logs:
            date_str = log.date.isoformat()
            if date_str in calendar_data:
                calendar_data[date_str]['habits'].append({
                    'id': log.habit_id,
                    'name': log.habit.name,
                    'completed': log.completed,
                    'color': log.habit.color
                })
        
        return jsonify({
            'year': year,
            'month': month,
            'calendar': list(calendar_data.values())
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@calendar_bp.route('/<int:event_id>', methods=['PUT'])
@jwt_required()
def update_calendar_event(event_id):
    """Update a calendar event"""
    try:
        user_id = int(get_jwt_identity())
        event = CalendarEvent.query.filter_by(id=event_id, user_id=user_id).first()
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            event.title = data['title']
        if 'description' in data:
            event.description = data['description']
        if 'start_time' in data:
            event.start_time = datetime.fromisoformat(data['start_time'])
        if 'end_time' in data:
            event.end_time = datetime.fromisoformat(data['end_time'])
        if 'event_type' in data:
            event.event_type = data['event_type']
        if 'location' in data:
            event.location = data['location']
        if 'priority' in data:
            event.priority = data['priority']
        if 'color' in data:
            event.color = data['color']
        if 'reminder' in data:
            event.reminder = data['reminder']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Event updated successfully',
            'event': event.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@calendar_bp.route('/<int:event_id>', methods=['DELETE'])
@jwt_required()
def delete_calendar_event(event_id):
    """Delete a calendar event"""
    try:
        user_id = int(get_jwt_identity())
        event = CalendarEvent.query.filter_by(id=event_id, user_id=user_id).first()
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': 'Event deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


def get_priority_color(priority):
    """Get color based on task priority"""
    colors = {
        'high': '#EF4444',
        'medium': '#F59E0B',
        'low': '#10B981'
    }
    return colors.get(priority, '#6B7280')

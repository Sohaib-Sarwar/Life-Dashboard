from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Habit, HabitLog, db
from datetime import datetime, date, timedelta
from sqlalchemy import func

habits_bp = Blueprint('habits', __name__)


@habits_bp.route('', methods=['GET'])
@jwt_required()
def get_habits():
    """Get all habits for current user"""
    try:
        user_id = int(get_jwt_identity())
        habits = Habit.query.filter_by(user_id=user_id).order_by(Habit.created_at.desc()).all()
        
        # Include streak information
        habits_data = []
        for habit in habits:
            habit_dict = habit.to_dict()
            habit_dict['current_streak'] = calculate_streak(habit.id)
            habit_dict['completion_rate'] = calculate_completion_rate(habit.id)
            habits_data.append(habit_dict)
        
        return jsonify(habits_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@habits_bp.route('', methods=['POST'])
@jwt_required()
def create_habit():
    """Create a new habit"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data.get('name'):
            return jsonify({'error': 'Name is required'}), 400
        
        habit = Habit(
            user_id=user_id,
            name=data['name'],
            description=data.get('description'),
            frequency=data.get('frequency', 'daily'),
            target_days=data.get('target_days', 7),
            color=data.get('color', '#3B82F6')
        )
        
        db.session.add(habit)
        db.session.commit()
        
        return jsonify({
            'message': 'Habit created successfully',
            'habit': habit.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@habits_bp.route('/<int:habit_id>', methods=['PUT'])
@jwt_required()
def update_habit(habit_id):
    """Update a habit"""
    try:
        user_id = int(get_jwt_identity())
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
        
        if not habit:
            return jsonify({'error': 'Habit not found'}), 404
        
        data = request.get_json()
        
        if 'name' in data:
            habit.name = data['name']
        if 'description' in data:
            habit.description = data['description']
        if 'frequency' in data:
            habit.frequency = data['frequency']
        if 'target_days' in data:
            habit.target_days = data['target_days']
        if 'color' in data:
            habit.color = data['color']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Habit updated successfully',
            'habit': habit.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@habits_bp.route('/<int:habit_id>', methods=['DELETE'])
@jwt_required()
def delete_habit(habit_id):
    """Delete a habit"""
    try:
        user_id = int(get_jwt_identity())
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
        
        if not habit:
            return jsonify({'error': 'Habit not found'}), 404
        
        db.session.delete(habit)
        db.session.commit()
        
        return jsonify({'message': 'Habit deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@habits_bp.route('/<int:habit_id>/log', methods=['POST'])
@jwt_required()
def log_habit(habit_id):
    """Log habit completion for a specific date"""
    try:
        user_id = int(get_jwt_identity())
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
        
        if not habit:
            return jsonify({'error': 'Habit not found'}), 404
        
        data = request.get_json()
        log_date = datetime.fromisoformat(data.get('date')).date() if data.get('date') else date.today()
        
        # Check if log already exists
        existing_log = HabitLog.query.filter_by(habit_id=habit_id, date=log_date).first()
        
        if existing_log:
            existing_log.completed = data.get('completed', True)
            existing_log.notes = data.get('notes')
        else:
            log = HabitLog(
                habit_id=habit_id,
                date=log_date,
                completed=data.get('completed', True),
                notes=data.get('notes')
            )
            db.session.add(log)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Habit logged successfully',
            'current_streak': calculate_streak(habit_id)
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@habits_bp.route('/<int:habit_id>/logs', methods=['GET'])
@jwt_required()
def get_habit_logs(habit_id):
    """Get logs for a specific habit"""
    try:
        user_id = int(get_jwt_identity())
        habit = Habit.query.filter_by(id=habit_id, user_id=user_id).first()
        
        if not habit:
            return jsonify({'error': 'Habit not found'}), 404
        
        # Get date range from query params
        days = int(request.args.get('days', 30))
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        logs = HabitLog.query.filter(
            HabitLog.habit_id == habit_id,
            HabitLog.date >= start_date,
            HabitLog.date <= end_date
        ).order_by(HabitLog.date.desc()).all()
        
        return jsonify([log.to_dict() for log in logs]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


def calculate_streak(habit_id):
    """Calculate current streak for a habit"""
    today = date.today()
    streak = 0
    current_date = today
    
    while True:
        log = HabitLog.query.filter_by(
            habit_id=habit_id,
            date=current_date,
            completed=True
        ).first()
        
        if log:
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break
        
        # Prevent infinite loop
        if streak > 365:
            break
    
    return streak


def calculate_completion_rate(habit_id):
    """Calculate completion rate for last 30 days"""
    end_date = date.today()
    start_date = end_date - timedelta(days=30)
    
    total_days = 30
    completed_days = HabitLog.query.filter(
        HabitLog.habit_id == habit_id,
        HabitLog.date >= start_date,
        HabitLog.date <= end_date,
        HabitLog.completed == True
    ).count()
    
    return round((completed_days / total_days) * 100, 1)

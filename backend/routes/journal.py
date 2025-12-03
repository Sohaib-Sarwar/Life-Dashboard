from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import JournalEntry, db
from datetime import datetime, date

journal_bp = Blueprint('journal', __name__)


@journal_bp.route('', methods=['GET'])
@jwt_required()
def get_journal_entries():
    """Get all journal entries for current user"""
    try:
        identity = get_jwt_identity()
        if identity is None:
            return jsonify({'error': 'Invalid token: user identity not found'}), 401
        
        user_id = int(identity)
        
        # Optional filters
        search = request.args.get('search')
        mood = request.args.get('mood')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = JournalEntry.query.filter_by(user_id=user_id)
        
        if search:
            query = query.filter(
                (JournalEntry.title.ilike(f'%{search}%')) |
                (JournalEntry.content.ilike(f'%{search}%'))
            )
        if mood:
            query = query.filter_by(mood=mood)
        if start_date:
            query = query.filter(JournalEntry.date >= datetime.fromisoformat(start_date).date())
        if end_date:
            query = query.filter(JournalEntry.date <= datetime.fromisoformat(end_date).date())
        
        entries = query.order_by(JournalEntry.date.desc()).all()
        
        return jsonify([entry.to_dict() for entry in entries]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@journal_bp.route('', methods=['POST'])
@jwt_required()
def create_journal_entry():
    """Create a new journal entry"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data.get('content'):
            return jsonify({'error': 'Content is required'}), 400
        
        # Convert tags list to comma-separated string
        tags = ','.join(data.get('tags', [])) if data.get('tags') else ''
        
        entry = JournalEntry(
            user_id=user_id,
            title=data.get('title'),
            content=data['content'],
            mood=data.get('mood'),
            tags=tags,
            date=datetime.fromisoformat(data['date']).date() if data.get('date') else date.today()
        )
        
        db.session.add(entry)
        db.session.commit()
        
        return jsonify({
            'message': 'Journal entry created successfully',
            'entry': entry.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@journal_bp.route('/<int:entry_id>', methods=['GET'])
@jwt_required()
def get_journal_entry(entry_id):
    """Get a specific journal entry"""
    try:
        user_id = int(get_jwt_identity())
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Journal entry not found'}), 404
        
        return jsonify(entry.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@journal_bp.route('/<int:entry_id>', methods=['PUT'])
@jwt_required()
def update_journal_entry(entry_id):
    """Update a journal entry"""
    try:
        user_id = int(get_jwt_identity())
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Journal entry not found'}), 404
        
        data = request.get_json()
        
        if 'title' in data:
            entry.title = data['title']
        if 'content' in data:
            entry.content = data['content']
        if 'mood' in data:
            entry.mood = data['mood']
        if 'tags' in data:
            entry.tags = ','.join(data['tags']) if data['tags'] else ''
        if 'date' in data:
            entry.date = datetime.fromisoformat(data['date']).date()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Journal entry updated successfully',
            'entry': entry.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@journal_bp.route('/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_journal_entry(entry_id):
    """Delete a journal entry"""
    try:
        user_id = int(get_jwt_identity())
        entry = JournalEntry.query.filter_by(id=entry_id, user_id=user_id).first()
        
        if not entry:
            return jsonify({'error': 'Journal entry not found'}), 404
        
        db.session.delete(entry)
        db.session.commit()
        
        return jsonify({'message': 'Journal entry deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

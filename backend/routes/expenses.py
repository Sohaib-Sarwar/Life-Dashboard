from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Expense, db
from datetime import datetime, date, timedelta
from sqlalchemy import func, extract

expenses_bp = Blueprint('expenses', __name__)


@expenses_bp.route('', methods=['GET'])
@jwt_required()
def get_expenses():
    """Get all expenses for current user"""
    try:
        user_id = int(get_jwt_identity())
        
        # Optional filters
        category = request.args.get('category')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = Expense.query.filter_by(user_id=user_id)
        
        if category:
            query = query.filter_by(category=category)
        if start_date:
            query = query.filter(Expense.date >= datetime.fromisoformat(start_date).date())
        if end_date:
            query = query.filter(Expense.date <= datetime.fromisoformat(end_date).date())
        
        expenses = query.order_by(Expense.date.desc()).all()
        
        return jsonify([expense.to_dict() for expense in expenses]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@expenses_bp.route('', methods=['POST'])
@jwt_required()
def create_expense():
    """Create a new expense"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data.get('amount') or not data.get('category'):
            return jsonify({'error': 'Amount and category are required'}), 400
        
        expense = Expense(
            user_id=user_id,
            amount=data['amount'],
            category=data['category'],
            description=data.get('description'),
            date=datetime.fromisoformat(data['date']).date() if data.get('date') else date.today(),
            payment_method=data.get('payment_method')
        )
        
        db.session.add(expense)
        db.session.commit()
        
        return jsonify({
            'message': 'Expense created successfully',
            'expense': expense.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@expenses_bp.route('/<int:expense_id>', methods=['PUT'])
@jwt_required()
def update_expense(expense_id):
    """Update an expense"""
    try:
        user_id = int(get_jwt_identity())
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        data = request.get_json()
        
        if 'amount' in data:
            expense.amount = data['amount']
        if 'category' in data:
            expense.category = data['category']
        if 'description' in data:
            expense.description = data['description']
        if 'date' in data:
            expense.date = datetime.fromisoformat(data['date']).date()
        if 'payment_method' in data:
            expense.payment_method = data['payment_method']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Expense updated successfully',
            'expense': expense.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@expenses_bp.route('/<int:expense_id>', methods=['DELETE'])
@jwt_required()
def delete_expense(expense_id):
    """Delete an expense"""
    try:
        user_id = int(get_jwt_identity())
        expense = Expense.query.filter_by(id=expense_id, user_id=user_id).first()
        
        if not expense:
            return jsonify({'error': 'Expense not found'}), 404
        
        db.session.delete(expense)
        db.session.commit()
        
        return jsonify({'message': 'Expense deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@expenses_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_expense_summary():
    """Get expense summary with analytics"""
    try:
        user_id = int(get_jwt_identity())
        
        # Get time period from query params
        period = request.args.get('period', 'month')  # month, week, year
        
        if period == 'week':
            start_date = date.today() - timedelta(days=7)
        elif period == 'year':
            start_date = date.today() - timedelta(days=365)
        else:  # month
            start_date = date.today() - timedelta(days=30)
        
        # Total expenses
        total = db.session.query(func.sum(Expense.amount)).filter(
            Expense.user_id == user_id,
            Expense.date >= start_date
        ).scalar() or 0
        
        # Category breakdown
        category_breakdown = db.session.query(
            Expense.category,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == user_id,
            Expense.date >= start_date
        ).group_by(Expense.category).all()
        
        # Daily expenses (for chart)
        daily_expenses = db.session.query(
            Expense.date,
            func.sum(Expense.amount).label('total')
        ).filter(
            Expense.user_id == user_id,
            Expense.date >= start_date
        ).group_by(Expense.date).order_by(Expense.date).all()
        
        return jsonify({
            'total': float(total),
            'period': period,
            'start_date': start_date.isoformat(),
            'end_date': date.today().isoformat(),
            'category_breakdown': [
                {'category': cat, 'total': float(total)}
                for cat, total in category_breakdown
            ],
            'daily_expenses': [
                {'date': d.isoformat(), 'total': float(total)}
                for d, total in daily_expenses
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@expenses_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    """Get all expense categories used by user"""
    try:
        user_id = int(get_jwt_identity())
        
        categories = db.session.query(Expense.category).filter(
            Expense.user_id == user_id
        ).distinct().all()
        
        return jsonify([cat[0] for cat in categories]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

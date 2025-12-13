from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import User, db

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    """Register a new user"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400

        # Check if user already exists
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 409

        # Create new user
        user = User(
            email=data["email"],
            first_name=data.get("first_name", ""),
            last_name=data.get("last_name", ""),
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()

        # Create access token
        access_token = create_access_token(identity=str(user.id))

        return (
            jsonify(
                {
                    "message": "User registered successfully",
                    "user": user.to_dict(),
                    "access_token": access_token,
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/login", methods=["POST"])
def login():
    """User login"""
    try:
        from datetime import date, timedelta

        data = request.get_json()

        # Validate required fields
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password are required"}), 400

        # Find user
        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return jsonify({"error": "Invalid email or password"}), 401

        # Update login streak
        today = date.today()

        if user.last_login is None:
            # First login
            user.current_streak = 1
            user.longest_streak = 1
        elif user.last_login == today:
            # Already logged in today, no change
            pass
        elif user.last_login == today - timedelta(days=1):
            # Consecutive day login
            user.current_streak += 1
            if user.current_streak > user.longest_streak:
                user.longest_streak = user.current_streak
        else:
            # Streak broken
            user.current_streak = 1

        user.last_login = today
        db.session.commit()

        # Create access token
        access_token = create_access_token(identity=str(user.id))

        return (
            jsonify(
                {
                    "message": "Login successful",
                    "user": user.to_dict(),
                    "access_token": access_token,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    """Get current user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify(user.to_dict()), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    """Update user profile"""
    try:
        user_id = int(get_jwt_identity())
        user = User.query.get(user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()

        # Update fields
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        if "theme_preference" in data:
            user.theme_preference = data["theme_preference"]

        db.session.commit()

        return (
            jsonify(
                {"message": "Profile updated successfully", "user": user.to_dict()}
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

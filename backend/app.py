from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from config import config
import os
import logging
from logging.handlers import RotatingFileHandler

# Initialize extensions
jwt = JWTManager()
migrate = Migrate()


def create_app(config_name="default"):
    """Application factory pattern"""
    app = Flask(__name__)

    # Load configuration
    app.config.from_object(config[config_name])

    # Configure logging
    if not app.debug and not app.testing:
        # Production: Log to file
        if not os.path.exists("logs"):
            os.mkdir("logs")
        file_handler = RotatingFileHandler(
            "logs/life_dashboard.log", maxBytes=10240, backupCount=10
        )
        file_handler.setFormatter(
            logging.Formatter(
                "%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]"
            )
        )
        file_handler.setLevel(logging.INFO)
        app.logger.addHandler(file_handler)

        app.logger.setLevel(logging.INFO)
        app.logger.info("Life Dashboard startup")
    else:
        # Development: Log to console with colors
        class ColoredFormatter(logging.Formatter):
            # ANSI Color Codes
            grey = "\x1b[38;20m"
            cyan = "\x1b[36;20m"
            green = "\x1b[32;20m"
            yellow = "\x1b[33;20m"
            red = "\x1b[31;20m"
            bold_red = "\x1b[31;1m"
            reset = "\x1b[0m"

            def format(self, record):
                level_colors = {
                    logging.DEBUG: (self.grey, "🐛"),
                    logging.INFO: (self.green, "ℹ️ "),
                    logging.WARNING: (self.yellow, "⚠️ "),
                    logging.ERROR: (self.red, "❌"),
                    logging.CRITICAL: (self.bold_red, "🔥"),
                }

                color, icon = level_colors.get(record.levelno, (self.reset, "•"))

                timestamp = (
                    f"{self.cyan}[{self.formatTime(record, '%H:%M:%S')}]{self.reset}"
                )
                level = f"{color}{record.levelname:<8}{self.reset}"
                message = record.getMessage()

                return f"{timestamp} {icon} {level} {message}"

        # Clear all existing handlers to prevent double logging
        logging.getLogger().handlers.clear()

        # Create and add the colored console handler
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(ColoredFormatter())

        # Configure root logger
        root_logger = logging.getLogger()
        root_logger.addHandler(console_handler)
        root_logger.setLevel(logging.INFO)

        # Ensure app logger propagates to root
        app.logger.propagate = True

        # Configure werkzeug (Flask) logger
        logging.getLogger("werkzeug").setLevel(logging.INFO)

    # Import db from models to avoid circular imports
    from models import db
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    migrate.init_app(app, db)
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": app.config["FRONTEND_URL"],
                "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                "allow_headers": ["Content-Type", "Authorization"],
            }
        },
    )

    # Import models here to register them with SQLAlchemy
    with app.app_context():
        from models import (
            User,
            Task,
            Habit,
            HabitLog,
            Expense,
            JournalEntry,
            CalendarEvent,
        )

    # Register blueprints
    from routes.auth import auth_bp
    from routes.tasks import tasks_bp
    from routes.habits import habits_bp
    from routes.expenses import expenses_bp
    from routes.journal import journal_bp
    from routes.calendar import calendar_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(tasks_bp, url_prefix="/api/tasks")
    app.register_blueprint(habits_bp, url_prefix="/api/habits")
    app.register_blueprint(expenses_bp, url_prefix="/api/expenses")
    app.register_blueprint(journal_bp, url_prefix="/api/journal")
    app.register_blueprint(calendar_bp, url_prefix="/api/calendar")

    # JWT error handlers
    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        app.logger.error(f"Invalid token error: {error}")
        return {"error": "Invalid token", "message": str(error)}, 422

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        app.logger.error(f"Unauthorized error: {error}")
        return {"error": "Missing authorization header", "message": str(error)}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        app.logger.warning(
            f"Expired token - header: {jwt_header}, payload: {jwt_payload}"
        )
        return {"error": "Token has expired", "message": "Please login again"}, 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        app.logger.warning(
            f"Revoked token - header: {jwt_header}, payload: {jwt_payload}"
        )
        return {"error": "Token has been revoked", "message": "Please login again"}, 401

    @jwt.token_verification_failed_loader
    def token_verification_failed_callback(jwt_header, jwt_payload):
        app.logger.error(
            f"Token verification failed - header: {jwt_header}, payload: {jwt_payload}"
        )
        return {
            "error": "Token verification failed",
            "message": "Please login again",
        }, 422

    # Health check endpoint
    @app.route("/api/health")
    def health_check():
        return {"status": "healthy", "message": "Life Dashboard API is running"}, 200

    return app


if __name__ == "__main__":
    app = create_app(os.getenv("FLASK_ENV", "development"))

    app.logger.info("🚀 Flask server starting on http://localhost:5000")
    app.logger.info("📊 Database: life_dashboard")
    app.logger.info("✅ All routes registered and ready")

    app.run(host="localhost", port=5000, debug=True)

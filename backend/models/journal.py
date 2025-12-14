from datetime import datetime
from models import db
from cryptography.fernet import Fernet
import base64
import hashlib
import os


def get_encryption_key():
    """Generate a secure encryption key from the configured key"""
    from flask import current_app
    key = current_app.config.get('ENCRYPTION_KEY', 'your-32-byte-encryption-key-change-in-production')
    # Derive a proper 32-byte key using SHA-256
    key_bytes = hashlib.sha256(key.encode()).digest()
    return base64.urlsafe_b64encode(key_bytes)


def encrypt_content(content):
    """Encrypt journal content"""
    if not content:
        return None
    try:
        fernet = Fernet(get_encryption_key())
        encrypted = fernet.encrypt(content.encode())
        return encrypted.decode()
    except Exception as e:
        print(f"Encryption error: {e}")
        return content


def decrypt_content(encrypted_content):
    """Decrypt journal content"""
    if not encrypted_content:
        return None
    try:
        fernet = Fernet(get_encryption_key())
        decrypted = fernet.decrypt(encrypted_content.encode())
        return decrypted.decode()
    except Exception as e:
        print(f"Decryption error: {e}")
        # If decryption fails, return as-is (for backward compatibility with unencrypted data)
        return encrypted_content


class JournalEntry(db.Model):
    __tablename__ = "journal_entries"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(500))  # Increased for encrypted title
    content = db.Column(db.Text, nullable=False)
    mood = db.Column(db.String(20))
    tags = db.Column(db.String(200))
    date = db.Column(db.Date, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def set_content(self, content):
        """Encrypt and set content"""
        self.content = encrypt_content(content)

    def get_content(self):
        """Decrypt and get content"""
        return decrypt_content(self.content)

    def set_title(self, title):
        """Encrypt and set title"""
        self.title = encrypt_content(title) if title else None

    def get_title(self):
        """Decrypt and get title"""
        return decrypt_content(self.title) if self.title else None

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.get_title(),
            "content": self.get_content(),
            "mood": self.mood,
            "tags": self.tags.split(",") if self.tags else [],
            "date": self.date.isoformat() if self.date else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

"""add category to tasks

Revision ID: 20251214151657
Revises: 4db631c7b28a
Create Date: 2025-12-14 15:16:57

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '20251214151657'
down_revision = '4db631c7b28a'
branch_labels = None
depends_on = None


def upgrade():
    # Add category column to tasks table
    op.add_column('tasks', sa.Column('category', sa.String(length=50), nullable=True))


def downgrade():
    # Remove category column from tasks table
    op.drop_column('tasks', 'category')

"""Increase journal fields for encryption

Revision ID: 07c3d1250fea
Revises: 22b30293cad2
Create Date: 2025-12-14 23:51:41.487505

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '07c3d1250fea'
down_revision = '22b30293cad2'
branch_labels = None
depends_on = None


def upgrade():
    # Increase title field size to accommodate encrypted data
    with op.batch_alter_table('journal_entries', schema=None) as batch_op:
        batch_op.alter_column('title',
                              existing_type=sa.String(length=200),
                              type_=sa.String(length=500),
                              existing_nullable=True)
        # Change content to MEDIUMTEXT for larger encrypted data
        batch_op.alter_column('content',
                              existing_type=sa.Text(),
                              type_=sa.Text(length=16777215),  # MEDIUMTEXT
                              existing_nullable=False)


def downgrade():
    # Revert to original field sizes
    with op.batch_alter_table('journal_entries', schema=None) as batch_op:
        batch_op.alter_column('title',
                              existing_type=sa.String(length=500),
                              type_=sa.String(length=200),
                              existing_nullable=True)
        batch_op.alter_column('content',
                              existing_type=sa.Text(length=16777215),
                              type_=sa.Text(),
                              existing_nullable=False)

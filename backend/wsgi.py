import os
import sys

sys.path.append(os.path.dirname(__file__))

from app import create_app

env = os.getenv("FLASK_ENV", "production")
app = create_app(env)

if "__name__" == "__main__":
    app.run()
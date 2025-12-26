<div align="center">

# Life Dashboard

### A Comprehensive Personal Productivity & Wellness Management Platform

[![Python Version](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org/downloads/)
[![Node Version](https://img.shields.io/badge/node-14%2B-brightgreen.svg)](https://nodejs.org/)
[![Flask Version](https://img.shields.io/badge/flask-3.0.0-black.svg)](https://flask.palletsprojects.com/)
[![React Version](https://img.shields.io/badge/react-18.0%2B-61dafb.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/license-Academic-yellow.svg)](LICENSE)

A full-stack web application designed to centralize personal productivity tools including task management, habit tracking, journaling, expense monitoring, calendar scheduling, and focus timing in a single, secure, and intuitive platform.

[Features](#features) •
[Architecture](#architecture) •
[Installation](#installation) •
[Documentation](#documentation) •
[Security](#security) •
[Contributing](#contributing)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Security Features](#security-features)
- [Development](#development)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Testing](#testing)
- [Contributing](#contributing)
- [Team](#team)
- [License](#license)
- [Support](#support)

---

## Overview

Life Dashboard is a modern, full-stack web application designed to consolidate multiple personal productivity and wellness tools into a unified platform. Built with React and Flask, it provides a seamless user experience for managing daily tasks, tracking habits, maintaining journals, monitoring expenses, scheduling events, and improving focus through Pomodoro sessions.

### Key Highlights

- **Unified Platform**: Single application for all personal management needs
- **Real-time Synchronization**: Instant updates across all modules
- **Secure by Design**: End-to-end encryption for sensitive data
- **Responsive Interface**: Optimized for desktop and mobile devices
- **Theme Support**: Dark and light mode with smooth transitions
- **Data Visualization**: Interactive charts and progress tracking

---

## Features

### 1. Task Management System

**Comprehensive task organization with priority-based workflow**

- Create, read, update, and delete tasks with full CRUD operations
- Priority levels: High, Medium, Low with visual indicators
- Category-based organization for better task grouping
- Due date tracking with automatic sorting
- Task status management: Pending, In Progress, Completed
- Timeline view for chronological task visualization
- Quick filters for status and priority
- Search functionality across task titles and descriptions
- Celebration animations on task completion

### 2. Habit Tracking System

**Build and maintain positive habits with visual progress tracking**

- Daily habit logging with streak calculation
- Frequency tracking: Daily, Weekly, Monthly, Custom
- Color-coded habit cards for quick identification
- Streak visualization with flame indicators
- Monthly completion calendar grid
- Progress statistics and analytics
- Habit history and completion patterns
- Reminder notifications for habit maintenance
- Success rate calculations

### 3. Journal & Notes System

**Private, encrypted journaling with mood tracking**

- Create rich-text journal entries with titles
- Mood tagging: Happy, Sad, Excited, Calm, Anxious, Neutral
- Tag-based organization for easy categorization
- Date-based browsing and filtering
- Full-text search across all entries
- **End-to-end encryption** for complete privacy
- Encrypted titles and content in database
- Markdown support for formatting
- Entry history and timestamps

### 4. Expense Tracking System

**Financial monitoring with category-based insights**

- Record expenses with amounts and descriptions
- Category management: Food, Transport, Shopping, Bills, Entertainment, Health, Other
- Date-based expense logging
- Monthly expense summaries
- Category-wise spending breakdown
- Visual charts and graphs (Pie charts, Bar graphs)
- Budget tracking against planned spending
- Expense history with filters
- Export capabilities for financial records

### 5. Calendar & Scheduling

**Integrated calendar system for event management**

- Monthly calendar view with event markers
- Create, edit, and delete calendar events
- Event time and date management
- Color-coded event categories
- Task and habit integration on calendar
- Reminder notifications for upcoming events
- Date selection with visual feedback
- Recurring event support
- Event search and filtering

### 6. Pomodoro Focus Timer

**Productivity enhancement through time management**

- Configurable work sessions (default: 25 minutes)
- Customizable break intervals (default: 5 minutes)
- Long break periods after multiple sessions
- Visual countdown timer with circular progress
- Session tracking and statistics
- Browser notifications on timer completion
- Pause, resume, and reset controls
- Work session counter
- Focus time analytics

### 7. User Authentication & Profile

**Secure account management system**

- User registration with validation
- Secure login with JWT tokens
- Password hashing using bcrypt
- Profile management and customization
- User preferences and settings
- Budget settings for expense tracking
- Age and demographic information
- Account security features
- Session management with auto-logout

### 8. Theme & Customization

**Personalized user experience**

- Dark mode: Pure black (#000000) background with high contrast
- Light mode: Pure white (#FFFFFF) background with subtle borders
- Smooth theme transitions with CSS animations
- Persistent theme preference across sessions
- Glassmorphic design elements
- Custom color palette for each module
- Accessible color contrast ratios
- Responsive design for all screen sizes

---

## Architecture

Life Dashboard follows a modern three-tier architecture pattern:

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Layer                    │
│              (React SPA with Context API)                │
└─────────────────────────────────────────────────────────┘
                           ↕ HTTP/JSON
┌─────────────────────────────────────────────────────────┐
│                     Application Layer                    │
│         (Flask REST API with JWT Authentication)         │
└─────────────────────────────────────────────────────────┘
                           ↕ SQLAlchemy ORM
┌─────────────────────────────────────────────────────────┐
│                       Data Layer                         │
│              (MySQL with Encrypted Storage)              │
└─────────────────────────────────────────────────────────┘
```

### Design Patterns

- **RESTful API**: Standardized HTTP methods and resource-based URLs
- **JWT Authentication**: Stateless token-based authentication
- **Context API**: Centralized state management in React
- **ORM Pattern**: Object-relational mapping with SQLAlchemy
- **Repository Pattern**: Data access abstraction layer
- **Encryption Layer**: Transparent encryption for sensitive data

---

## Technology Stack

### Frontend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | React.js | 18.0+ | User interface and component management |
| Build Tool | Vite | 5.0+ | Fast development server and optimized builds |
| HTTP Client | Axios | 1.6+ | API communication and request handling |
| Routing | React Router | 6.0+ | Client-side navigation and route management |
| Charts | Chart.js | 4.0+ | Data visualization and analytics |
| Icons | Material-UI Icons | 5.0+ | Consistent iconography |
| Notifications | Lucide React | Latest | Modern notification icons |
| State Management | React Context | Built-in | Global state management |
| Styling | Custom CSS + Variables | - | Theme-aware styling system |

### Backend Technologies

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Framework | Flask | 3.0.0 | Web application framework |
| ORM | Flask-SQLAlchemy | 3.1.1 | Database object-relational mapping |
| Authentication | Flask-JWT-Extended | 4.6.0 | JWT token management |
| Migrations | Flask-Migrate (Alembic) | 4.0.5 | Database version control |
| CORS | Flask-CORS | 4.0.0 | Cross-origin resource sharing |
| Database Driver | PyMySQL | 1.1.0 | MySQL database connectivity |
| Password Hashing | bcrypt | 4.1.2 | Secure password encryption |
| Data Encryption | cryptography (Fernet) | 41.0.7 | Symmetric encryption for sensitive data |
| Serialization | marshmallow | 3.20.1 | Data validation and serialization |
| Environment | python-dotenv | 1.0.0 | Environment variable management |

### Database

| Component | Technology | Purpose |
|-----------|-----------|---------|
| RDBMS | MySQL | 8.0+ | Primary data storage |
| Schema Management | Alembic | Database migrations and versioning |
| Connection Pool | SQLAlchemy Pool | Efficient database connection management |

### Development Tools

- **Version Control**: Git
- **Package Management**: npm (frontend), pip (backend)
- **API Testing**: Postman, Thunder Client
- **Code Formatting**: Prettier (JS), Black (Python)
- **Virtual Environment**: venv (Python)

---

## Prerequisites

Ensure the following software is installed on your system before proceeding with the installation:

### Required Software

| Software | Minimum Version | Purpose | Download Link |
|----------|----------------|---------|---------------|
| Node.js | 14.0.0 | JavaScript runtime for frontend | [nodejs.org](https://nodejs.org/) |
| npm | 6.0.0 | Package manager (comes with Node.js) | Included with Node.js |
| Python | 3.8.0 | Backend runtime environment | [python.org](https://www.python.org/) |
| MySQL | 8.0.0 | Relational database management system | [mysql.com](https://www.mysql.com/) |
| Git | 2.0.0 | Version control system | [git-scm.com](https://git-scm.com/) |

### System Requirements

- **Operating System**: Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 500MB free space
- **Network**: Internet connection for package installation

### Verification Commands

```bash
# Verify Node.js installation
node --version

# Verify npm installation
npm --version

# Verify Python installation
python --version

# Verify MySQL installation
mysql --version

# Verify Git installation
git --version
```

---

## Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone <repository-url>
cd Life_Dashboard
```

### Step 2: Database Setup

```bash
# Login to MySQL as root user
mysql -u root -p

# Execute the following SQL commands
CREATE DATABASE life_dashboard CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Create a dedicated database user (recommended)
CREATE USER 'dashboard_user'@'localhost' IDENTIFIED BY 'your_secure_password';

# Grant necessary privileges
GRANT ALL PRIVILEGES ON life_dashboard.* TO 'dashboard_user'@'localhost';
FLUSH PRIVILEGES;

# Verify database creation
SHOW DATABASES;

# Exit MySQL
EXIT;
```

### Step 3: Backend Configuration

#### 3.1 Create Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate

# On macOS/Linux:
source venv/bin/activate
```

#### 3.2 Install Python Dependencies

```bash
# Upgrade pip to latest version
python -m pip install --upgrade pip

# Install all required packages
pip install -r requirements.txt
```

#### 3.3 Environment Configuration

Create a `.env` file in the `backend` directory with the following configuration:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-change-in-production
FLASK_ENV=development
FLASK_APP=app.py

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=life_dashboard
DB_USER=dashboard_user
DB_PASSWORD=your_secure_password

# JWT Configuration
JWT_SECRET_KEY=your-jwt-secret-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRES=24

# Encryption Configuration
ENCRYPTION_KEY=your-32-byte-encryption-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

**Security Note**: Generate strong, unique keys for production deployment. Never commit `.env` files to version control.

#### 3.4 Initialize Database Schema

```bash
# Run database migrations
flask db upgrade

# Verify migration success
flask db current
```

#### 3.5 Start Backend Server

```bash
# Run Flask development server
python app.py

# Server will start at http://localhost:5000
```

### Step 4: Frontend Configuration

#### 4.1 Install Node Dependencies

```bash
# Open a new terminal window
cd frontend

# Install all npm packages
npm install

# Optional: Audit and fix vulnerabilities
npm audit fix
```

#### 4.2 Environment Configuration

Create a `.env` file in the `frontend` directory (if needed):

```env
VITE_API_URL=http://localhost:5000
```

#### 4.3 Start Development Server

```bash
# Start Vite development server
npm run dev

# Server will start at http://localhost:3001
```

### Step 5: Access the Application

Once both servers are running:

- **Frontend Application**: [http://localhost:3001](http://localhost:3001)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **API Documentation**: [http://localhost:5000/api](http://localhost:5000/api)

### Quick Start Script

For convenience, you can use the following script to start both servers:

```bash
# Create a start script (start.sh for Linux/Mac, start.bat for Windows)

# Linux/Mac (start.sh):
#!/bin/bash
cd backend && source venv/bin/activate && python app.py &
cd frontend && npm run dev &

# Windows (start.bat):
start cmd /k "cd backend && venv\Scripts\activate && python app.py"
start cmd /k "cd frontend && npm run dev"
```

---

## Configuration

### Backend Configuration Options

The backend supports the following configuration options through environment variables:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `SECRET_KEY` | Flask secret key for session encryption | - | Yes |
| `DB_HOST` | MySQL server hostname | localhost | Yes |
| `DB_PORT` | MySQL server port | 3306 | Yes |
| `DB_NAME` | Database name | life_dashboard | Yes |
| `DB_USER` | Database username | root | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `JWT_SECRET_KEY` | JWT token signing key | - | Yes |
| `JWT_ACCESS_TOKEN_EXPIRES` | Token expiration time (hours) | 24 | No |
| `ENCRYPTION_KEY` | Key for encrypting sensitive data | - | Yes |
| `FRONTEND_URL` | CORS allowed origin | http://localhost:3001 | Yes |

### Frontend Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | http://localhost:5000 |

### Security Configuration

For production deployment, ensure:

1. **Strong Encryption Keys**: Use cryptographically secure random keys
2. **HTTPS**: Enable SSL/TLS certificates
3. **CORS**: Restrict allowed origins to your domain
4. **Database**: Use strong passwords and limit user privileges
5. **Environment Variables**: Never expose in client-side code

---

## Database Schema

### Entity Relationship Diagram

```
┌──────────────┐         ┌──────────────┐
│    Users     │────────<│    Tasks     │
│              │         │              │
│  id (PK)     │         │  id (PK)     │
│  username    │         │  user_id(FK) │
│  email       │         │  title       │
│  password    │         │  description │
│  first_name  │         │  priority    │
│  last_name   │         │  due_date    │
│  age         │         │  category    │
│  budget      │         │  status      │
│  created_at  │         │  created_at  │
└──────────────┘         └──────────────┘
      │
      │                  ┌──────────────┐
      │─────────────────<│   Habits     │
      │                  │              │
      │                  │  id (PK)     │
      │                  │  user_id(FK) │
      │                  │  name        │
      │                  │  frequency   │
      │                  │  color       │
      │                  │  streak      │
      │                  │  created_at  │
      │                  └──────────────┘
      │
      │                  ┌──────────────┐
      │─────────────────<│   Expenses   │
      │                  │              │
      │                  │  id (PK)     │
      │                  │  user_id(FK) │
      │                  │  amount      │
      │                  │  category    │
      │                  │  description │
      │                  │  date        │
      │                  │  created_at  │
      │                  └──────────────┘
      │
      │                  ┌──────────────────┐
      │─────────────────<│ Journal Entries  │
      │                  │                  │
      │                  │  id (PK)         │
      │                  │  user_id (FK)    │
      │                  │  title (ENCR)    │
      │                  │  content (ENCR)  │
      │                  │  mood            │
      │                  │  tags            │
      │                  │  date            │
      │                  │  created_at      │
      │                  └──────────────────┘
      │
      │                  ┌──────────────┐
      └─────────────────<│ Calendar     │
                         │              │
                         │  id (PK)     │
                         │  user_id(FK) │
                         │  title       │
                         │  description │
                         │  date        │
                         │  time        │
                         │  category    │
                         │  color       │
                         │  reminder    │
                         │  created_at  │
                         └──────────────┘
```

### Table Descriptions

#### Users Table
Stores user account information and profile data.
- Primary authentication table with hashed passwords
- Links to all user-specific data across modules

#### Tasks Table
Manages user tasks with priority and status tracking.
- Supports categorization and due date management
- Status workflow: Pending → In Progress → Completed

#### Habits Table
Tracks daily habits with streak calculations.
- Stores habit logs for progress visualization
- Automatic streak computation based on completion frequency

#### Expenses Table
Records financial transactions with categorization.
- Supports budget tracking and spending analysis
- Date-based filtering for monthly summaries

#### Journal Entries Table
Stores encrypted personal journal entries.
- **Title and content are encrypted** using Fernet symmetric encryption
- Mood tracking and tag-based organization
- Client-side search after decryption

#### Calendar Table
Manages scheduled events and reminders.
- Color-coded categories for visual organization
- Time-based notifications and reminders

### Data Encryption

Journal entries implement **end-to-end encryption**:

```python
# Encryption Process:
1. User submits journal entry
2. Backend encrypts title and content using Fernet (AES-128)
3. Encrypted data stored in database
4. On retrieval, data is decrypted before sending to client

# Encryption Key Management:
- Derived from ENCRYPTION_KEY environment variable
- SHA-256 hashing for key derivation
- Base64 URL-safe encoding
```

---

## Project Structure

```
Life_Dashboard/
├── .git/                                  # Git version control
├── .venv/                                 # Python virtual environment
├── .gitignore                             # Git ignore rules
├── README.md                              # This file - Project documentation
│
├── backend/                               # Flask REST API
│   ├── app.py                            # Application entry point & server
│   ├── config.py                         # Configuration management
│   ├── requirements.txt                  # Python dependencies
│   │
│   ├── models/                           # Database models (SQLAlchemy)
│   │   ├── __init__.py                  # Model initialization & db instance
│   │   ├── user.py                      # User model with authentication
│   │   ├── task.py                      # Task management model
│   │   ├── habit.py                     # Habit tracking model
│   │   ├── expense.py                   # Expense tracking model
│   │   ├── journal.py                   # Journal model with encryption
│   │   └── calendar.py                  # Calendar events model
│   │
│   ├── routes/                          # API endpoint blueprints
│   │   ├── auth.py                      # Authentication & profile routes
│   │   ├── tasks.py                     # Task CRUD operations
│   │   ├── habits.py                    # Habit tracking & logging routes
│   │   ├── expenses.py                  # Expense management routes
│   │   ├── journal.py                   # Journal entry routes (encrypted)
│   │   └── calendar.py                  # Calendar event routes
│   │
│   └── migrations/                      # Database version control (Alembic)
│       ├── alembic.ini                 # Alembic configuration
│       ├── env.py                      # Migration environment setup
│       ├── README                      # Migration instructions
│       ├── script.py.mako              # Migration template
│       └── versions/                   # Migration scripts
│           ├── 7cb38c477f90_initial_migration.py
│           ├── 4db631c7b28a_add_color_and_reminder_fields_to_.py
│           ├── 22b30293cad2_add_age_and_budget_to_users.py
│           ├── 20251214151657_add_category_to_tasks.py
│           └── 07c3d1250fea_increase_journal_fields_for_encryption.py
│
└── frontend/                             # React Single Page Application
    ├── index.html                       # HTML entry point
    ├── package.json                     # npm dependencies and scripts
    ├── package-lock.json                # Locked dependency versions
    ├── vite.config.js                   # Vite build configuration
    │
    ├── public/                          # Static assets (served directly)
    │
    ├── dist/                            # Production build output (generated)
    │
    └── src/                             # Source code
        ├── main.jsx                     # React application entry point
        ├── App.jsx                      # Main App with routing & providers
        ├── index.css                    # Global styles & task animations
        │
        ├── components/                  # Reusable React components
        │   ├── Navbar.jsx              # Navigation bar with theme toggle
        │   ├── PrivateRoute.jsx        # Route protection HOC
        │   ├── ErrorBoundary.jsx       # Error catching wrapper
        │   └── Notification.jsx        # Toast notification system
        │
        ├── pages/                       # Page components (routes)
        │   ├── Home.jsx                # Dashboard with overview cards
        │   ├── Login.jsx               # User login form
        │   ├── Register.jsx            # User registration form
        │   ├── Profile.jsx             # User profile management
        │   ├── Tasks.jsx               # Task management interface
        │   ├── Habits.jsx              # Habit tracking interface
        │   ├── Journal.jsx             # Journal entries interface
        │   ├── Expenses.jsx            # Expense tracking interface
        │   ├── Calendar.jsx            # Calendar view with events
        │   └── Pomodoro.jsx            # Focus timer interface
        │
        ├── context/                     # React Context providers
        │   ├── AuthContext.jsx         # Authentication & user state
        │   └── ThemeContext.jsx        # Theme (dark/light) state
        │
        ├── services/                    # API communication layer
        │   └── api.js                  # Axios instance & interceptors
        │
        ├── hooks/                       # Custom React hooks
        │   └── useNotification.js      # Notification management hook
        │
        └── styles/                      # Styling system
            └── theme.css               # CSS variables & design system
```

### Key Files Description

| File | Purpose |
|------|---------|
| `backend/app.py` | Flask application factory, CORS, JWT, blueprint registration |
| `backend/config.py` | Environment-based configuration (dev/prod) |
| `backend/models/journal.py` | Encryption/decryption methods for journal data |
| `frontend/src/App.jsx` | React Router setup with protected routes |
| `frontend/src/context/AuthContext.jsx` | Global authentication state management |
| `frontend/src/services/api.js` | Axios configuration with JWT interceptors |
| `frontend/src/styles/theme.css` | CSS custom properties for theming |

---

---

## API Documentation

Base URL: `http://localhost:5000/api`

All protected endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Authentication Endpoints

#### Register New User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "string",
  "email": "string",
  "password": "string",
  "first_name": "string",
  "last_name": "string"
}

Response: 201 Created
{
  "message": "User registered successfully",
  "access_token": "string"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}

Response: 200 OK
{
  "access_token": "string",
  "user": {
    "id": "integer",
    "username": "string",
    "email": "string",
    "first_name": "string",
    "last_name": "string",
    "age": "integer",
    "budget": "float"
  }
}
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "first_name": "string",
  "last_name": "string",
  "age": "integer",
  "budget": "float"
}

Response: 200 OK
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Task Management Endpoints

#### Get All Tasks
```http
GET /api/tasks?status=pending&priority=high
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "priority": "high|medium|low",
    "due_date": "YYYY-MM-DD",
    "category": "string",
    "status": "pending|in_progress|completed",
    "created_at": "ISO 8601"
  }
]
```

#### Create Task
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "priority": "high|medium|low",
  "due_date": "YYYY-MM-DD",
  "category": "string"
}

Response: 201 Created
```

#### Update Task
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "status": "completed"
}

Response: 200 OK
```

#### Delete Task
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Task deleted successfully"
}
```

### Habit Tracking Endpoints

#### Get All Habits
```http
GET /api/habits
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "integer",
    "name": "string",
    "frequency": "daily|weekly|monthly",
    "color": "string",
    "streak": "integer",
    "logs": [
      {
        "date": "YYYY-MM-DD",
        "completed": "boolean"
      }
    ]
  }
]
```

#### Create Habit
```http
POST /api/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "string",
  "frequency": "daily",
  "color": "#hex"
}

Response: 201 Created
```

#### Log Habit Completion
```http
POST /api/habits/:id/log
Authorization: Bearer <token>
Content-Type: application/json

{
  "date": "YYYY-MM-DD",
  "completed": true
}

Response: 200 OK
```

### Expense Tracking Endpoints

#### Get All Expenses
```http
GET /api/expenses?start_date=2025-01-01&end_date=2025-12-31
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "integer",
    "amount": "float",
    "category": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "created_at": "ISO 8601"
  }
]
```

#### Get Expense Summary
```http
GET /api/expenses/summary?month=12&year=2025
Authorization: Bearer <token>

Response: 200 OK
{
  "total": "float",
  "by_category": {
    "Food": "float",
    "Transport": "float",
    ...
  },
  "budget": "float",
  "remaining": "float"
}
```

#### Create Expense
```http
POST /api/expenses
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": "float",
  "category": "Food|Transport|Shopping|Bills|Entertainment|Health|Other",
  "description": "string",
  "date": "YYYY-MM-DD"
}

Response: 201 Created
```

### Journal Endpoints

#### Get All Journal Entries
```http
GET /api/journal?search=keyword&mood=happy&start_date=2025-01-01
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "integer",
    "title": "string (decrypted)",
    "content": "string (decrypted)",
    "mood": "happy|sad|excited|calm|anxious|neutral",
    "tags": ["string"],
    "date": "YYYY-MM-DD",
    "created_at": "ISO 8601"
  }
]

Note: Title and content are encrypted in database, decrypted on retrieval.
```

#### Create Journal Entry
```http
POST /api/journal
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "mood": "happy",
  "tags": ["tag1", "tag2"],
  "date": "YYYY-MM-DD"
}

Response: 201 Created
Note: Title and content are automatically encrypted before storage.
```

#### Update Journal Entry
```http
PUT /api/journal/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "content": "string",
  "mood": "excited"
}

Response: 200 OK
```

### Calendar Endpoints

#### Get All Events
```http
GET /api/calendar?month=12&year=2025
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "id": "integer",
    "title": "string",
    "description": "string",
    "date": "YYYY-MM-DD",
    "time": "HH:MM",
    "category": "string",
    "color": "string",
    "reminder": "boolean"
  }
]
```

#### Create Event
```http
POST /api/calendar
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "category": "meeting|personal|work",
  "color": "#hex",
  "reminder": true
}

Response: 201 Created
```

### Error Responses

All endpoints may return the following error responses:

```http
400 Bad Request
{
  "error": "Validation error message"
}

401 Unauthorized
{
  "error": "Missing or invalid authentication token"
}

404 Not Found
{
  "error": "Resource not found"
}

500 Internal Server Error
{
  "error": "Server error message"
}
```

---

## Security Features

### Authentication & Authorization

1. **JWT Token-Based Authentication**
   - Stateless authentication using JSON Web Tokens
   - Token expiration after 24 hours (configurable)
   - Secure token storage in localStorage
   - Automatic token refresh mechanism

2. **Password Security**
   - Bcrypt hashing with salt rounds
   - Minimum password length enforcement
   - Password complexity validation (frontend)
   - No plain-text password storage

3. **User Authorization**
   - User-specific data isolation
   - Row-level security on all queries
   - User ID validation from JWT claims
   - Prevents unauthorized data access

### Data Encryption

1. **Journal Entry Encryption**
   - **Fernet symmetric encryption** (AES-128 in CBC mode)
   - HMAC for authentication and integrity
   - Unique encryption key per deployment
   - Titles and content encrypted at rest
   - Decryption only on authorized retrieval
   - Search performed post-decryption

2. **Encryption Implementation**
   ```python
   # Encryption flow:
   Client → Plain Text → Backend → Encrypt → Database
   Client ← Plain Text ← Backend ← Decrypt ← Database
   
   # Key derivation:
   ENCRYPTION_KEY → SHA-256 → Base64 URL-safe → Fernet Key
   ```

### Security Best Practices

| Security Measure | Implementation |
|------------------|----------------|
| SQL Injection Prevention | SQLAlchemy ORM with parameterized queries |
| XSS Protection | React auto-escaping, Content Security Policy |
| CSRF Protection | JWT tokens, same-origin policy |
| CORS Configuration | Restricted to frontend origin only |
| Input Validation | Server-side validation on all endpoints |
| Error Handling | Generic error messages (no sensitive data leakage) |
| Session Management | Secure token storage, auto-logout on expiration |
| HTTPS | Recommended for production deployment |
| Database Security | Limited user privileges, strong passwords |
| Environment Variables | Sensitive config excluded from version control |

### Production Security Checklist

- [ ] Generate strong, unique `SECRET_KEY` and `JWT_SECRET_KEY`
- [ ] Create a cryptographically secure `ENCRYPTION_KEY`
- [ ] Enable HTTPS with valid SSL/TLS certificate
- [ ] Configure restrictive CORS policy
- [ ] Use strong database passwords
- [ ] Limit database user privileges to necessary operations only
- [ ] Enable MySQL SSL connections
- [ ] Set up regular database backups
- [ ] Implement rate limiting on API endpoints
- [ ] Enable security headers (HSTS, X-Frame-Options, etc.)
- [ ] Configure firewall rules
- [ ] Set up logging and monitoring
- [ ] Perform security audit and penetration testing

## Development

### Development Workflow

#### Backend Development

```bash
# Activate virtual environment
cd backend
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate      # Windows

# Install development dependencies
pip install -r requirements.txt

# Run development server with auto-reload
export FLASK_ENV=development  # macOS/Linux
set FLASK_ENV=development     # Windows
python app.py

# Create a new database migration
flask db revision -m "Description of changes"

# Apply migrations
flask db upgrade

# Rollback last migration
flask db downgrade

# View current migration
flask db current
```

#### Frontend Development

```bash
# Start development server with hot reload
cd frontend
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Format code
npm run format
```

### Testing

#### Backend Testing

```bash
# Install testing dependencies
pip install pytest pytest-cov

# Run all tests
pytest

# Run with coverage report
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run with verbose output
pytest -v
```

#### Frontend Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

#### API Testing

Use tools like Postman, Thunder Client, or curl:

```bash
# Login and get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'

# Use token for authenticated requests
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <your-token>"
```

### Code Quality Standards

#### Python (Backend)

```bash
# Install linting tools
pip install flake8 black pylint

# Run linter
flake8 --max-line-length=100

# Format code
black .

# Type checking (optional)
pip install mypy
mypy .
```

Coding Standards:
- Follow PEP 8 style guide
- Maximum line length: 100 characters
- Use docstrings for functions and classes
- Type hints for function parameters

#### JavaScript (Frontend)

```bash
# Install ESLint and Prettier
npm install --save-dev eslint prettier

# Run linter
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix

# Format code
npm run format
```

Coding Standards:
- ES6+ syntax
- Functional components with hooks
- PropTypes or TypeScript for type checking
- Consistent naming conventions (camelCase)

### Debugging

#### Backend Debugging

```python
# Add breakpoints in code
import pdb; pdb.set_trace()

# Or use VS Code debugger
# Create .vscode/launch.json:
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Python: Flask",
      "type": "python",
      "request": "launch",
      "module": "flask",
      "env": {
        "FLASK_APP": "app.py",
        "FLASK_ENV": "development"
      },
      "args": ["run", "--no-debugger", "--no-reload"],
      "jinja": true
    }
  ]
}
```

#### Frontend Debugging

- Use React DevTools browser extension
- Use browser console for logging
- Add debugger statements in code
- Configure VS Code debugger for Chrome/Edge

### Database Management

```bash
# Backup database
mysqldump -u dashboard_user -p life_dashboard > backup.sql

# Restore database
mysql -u dashboard_user -p life_dashboard < backup.sql

# Access MySQL shell
mysql -u dashboard_user -p life_dashboard

# View all tables
SHOW TABLES;

# Describe table structure
DESCRIBE users;

# View migration history
SELECT * FROM alembic_version;
```

### Environment Management

#### Multiple Environments

```bash
# Development
cp .env.example .env.dev

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.prod

# Load specific environment
source .env.dev  # or use python-dotenv
```

### Performance Monitoring

#### Backend Performance

```python
# Add timing middleware
from time import time

@app.before_request
def before_request():
    g.start = time()

@app.after_request
def after_request(response):
    diff = time() - g.start
    print(f"Request took {diff:.3f} seconds")
    return response
```

#### Frontend Performance

```javascript
// Use React DevTools Profiler
import { Profiler } from 'react';

<Profiler id="TaskList" onRender={callback}>
  <TaskList />
</Profiler>
```

---

## Deployment

### Production Deployment

#### Backend Deployment Options

**Option 1: Traditional Server (Ubuntu/Debian)**

```bash
# Install dependencies
sudo apt update
sudo apt install python3 python3-pip mysql-server nginx

# Clone repository
git clone <repository-url>
cd Life_Dashboard/backend

# Setup virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install production WSGI server
pip install gunicorn

# Configure environment variables
nano .env

# Run database migrations
flask db upgrade

# Start with Gunicorn
gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

# Setup as systemd service
sudo nano /etc/systemd/system/lifedashboard.service
```

**Systemd Service File:**

```ini
[Unit]
Description=Life Dashboard Backend
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/Life_Dashboard/backend
Environment="PATH=/path/to/Life_Dashboard/backend/venv/bin"
ExecStart=/path/to/Life_Dashboard/backend/venv/bin/gunicorn --bind 0.0.0.0:5000 --workers 4 app:app

[Install]
WantedBy=multi-user.target
```

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

**Option 2: Docker Deployment**

```dockerfile
# Backend Dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "app:app"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - DB_HOST=mysql
      - DB_NAME=life_dashboard
      - DB_USER=root
      - DB_PASSWORD=${DB_PASSWORD}
    depends_on:
      - mysql

  mysql:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DB_PASSWORD}
      MYSQL_DATABASE: life_dashboard
    volumes:
      - mysql_data:/var/lib/mysql

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mysql_data:
```

**Option 3: Platform as a Service (PaaS)**

- **Heroku**: Use Heroku Postgres and deploy with git push
- **Railway**: Connect GitHub repo and deploy automatically
- **Render**: Web service with automatic deployments
- **DigitalOcean App Platform**: Managed deployment with database

#### Frontend Deployment Options

**Option 1: Static Hosting**

```bash
# Build production bundle
cd frontend
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod

# Deploy to Vercel
npx vercel --prod

# Deploy to GitHub Pages
npm install gh-pages --save-dev
npm run build
npx gh-pages -d dist
```

**Option 2: Nginx Static Server**

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/lifedashboard;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://127.0.0.1:5000;
    }
}
```

**Option 3: CDN Deployment**

- **Cloudflare Pages**: Connect GitHub and auto-deploy
- **AWS S3 + CloudFront**: Static hosting with global CDN
- **Azure Static Web Apps**: Serverless static hosting

### SSL/TLS Configuration

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com

# Auto-renewal
sudo certbot renew --dry-run
```

### Production Checklist

- [ ] Set strong environment variables
- [ ] Enable HTTPS with valid SSL certificate
- [ ] Configure database backups
- [ ] Set up error logging and monitoring
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up CDN for static assets
- [ ] Configure CORS for production domain
- [ ] Enable database connection pooling
- [ ] Set up health check endpoints
- [ ] Configure automated deployments (CI/CD)
- [ ] Implement database migration strategy
- [ ] Set up monitoring and alerting
- [ ] Document rollback procedures

### Monitoring and Maintenance

```bash
# Application logs
tail -f /var/log/lifedashboard/app.log

# Database logs
tail -f /var/log/mysql/error.log

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# System resources
htop
df -h
free -m
```

---

## Testing

### Test Coverage

#### Backend Tests

Create `tests/` directory with test files:

```python
# tests/test_auth.py
import pytest
from app import create_app
from models import db, User

@pytest.fixture
def client():
    app = create_app('testing')
    with app.test_client() as client:
        with app.app_context():
            db.create_all()
        yield client
        with app.app_context():
            db.drop_all()

def test_register(client):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert 'access_token' in response.json

def test_login(client):
    # Register user first
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    
    # Test login
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 200
    assert 'access_token' in response.json
```

#### Frontend Tests

```javascript
// src/components/__tests__/Navbar.test.jsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

test('renders navigation links', () => {
  render(
    <BrowserRouter>
      <Navbar />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Tasks')).toBeInTheDocument();
  expect(screen.getByText('Habits')).toBeInTheDocument();
});
```

### Manual Testing Checklist

- [ ] User registration with valid data
- [ ] User registration with duplicate email
- [ ] User login with correct credentials
- [ ] User login with incorrect credentials
- [ ] Create task with all fields
- [ ] Edit existing task
- [ ] Delete task
- [ ] Mark task as complete
- [ ] Filter tasks by status/priority
- [ ] Create habit and log completion
- [ ] Track habit streak accurately
- [ ] Create encrypted journal entry
- [ ] Search journal entries
- [ ] Add expense and categorize
- [ ] View expense charts
- [ ] Create calendar event
- [ ] Start Pomodoro timer
- [ ] Toggle dark/light theme
- [ ] Update user profile
- [ ] Test on mobile devices
- [ ] Test on different browsers

---

## Contributing

We welcome contributions from the community. Please follow these guidelines:

### Contribution Process

1. **Fork the Repository**
   ```bash
   # Click "Fork" on GitHub
   git clone https://github.com/your-username/Life_Dashboard.git
   cd Life_Dashboard
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/descriptive-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Write clean, readable code
   - Follow existing code style and conventions
   - Add comments for complex logic
   - Update documentation if needed

4. **Test Your Changes**
   ```bash
   # Run backend tests
   cd backend && pytest
   
   # Run frontend tests
   cd frontend && npm test
   
   # Manual testing
   # Test affected features thoroughly
   ```

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add task filtering by category"
   
   # Use conventional commit messages:
   # feat: New feature
   # fix: Bug fix
   # docs: Documentation changes
   # style: Code style changes (formatting)
   # refactor: Code refactoring
   # test: Adding or updating tests
   # chore: Maintenance tasks
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/descriptive-feature-name
   ```

7. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Provide a clear description of changes
   - Link any related issues

### Code Review Process

- All submissions require review before merging
- Reviewers may request changes
- Address feedback and push updates
- Once approved, maintainers will merge

### Contribution Guidelines

#### Code Style

**Python (Backend)**
- Follow PEP 8 style guide
- Use meaningful variable and function names
- Add docstrings to functions and classes
- Maximum line length: 100 characters
- Use type hints where appropriate

**JavaScript (Frontend)**
- Use ES6+ syntax
- Functional components with hooks
- Use descriptive variable names (camelCase)
- Add JSDoc comments for complex functions
- Consistent formatting with Prettier

#### Commit Messages

Use conventional commit format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

Examples:
- `feat(tasks): add priority filter to task list`
- `fix(auth): resolve token expiration issue`
- `docs(readme): update installation instructions`

#### Pull Request Guidelines

- **Title**: Clear and descriptive
- **Description**: Explain what and why
- **Testing**: Describe how to test changes
- **Screenshots**: Include for UI changes
- **Breaking Changes**: Clearly document any breaking changes

#### Reporting Issues

When reporting bugs, include:
- **Title**: Brief description of the issue
- **Description**: Detailed explanation
- **Steps to Reproduce**: Numbered list
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: OS, browser, versions
- **Screenshots**: If applicable
- **Error Messages**: Full error text

---

## Team

### ByteBuilders

This project was developed by the ByteBuilders team as part of an academic project at National University of Sciences and Technology (NUST).

#### Tech Lead

**Muhammad Sohaib Sarwar**
- Project architecture and technical direction
- System design and implementation oversight
- Code quality and best practices enforcement
- Team coordination and technical mentorship

#### Team Members

- **Frontend Development**
  - User interface design and implementation
  - React component architecture
  - State management and routing
  - Theme system and animations

- **Backend Development**
  - RESTful API design and implementation
  - Database schema design
  - Authentication and authorization
  - Data encryption implementation

- **Database Management**
  - MySQL database setup and optimization
  - Migration scripts and version control
  - Data modeling and relationships
  - Query optimization

- **Data Visualization**
  - Chart.js integration
  - Expense analytics dashboard
  - Habit progress tracking
  - Statistical calculations

- **Documentation & Testing**
  - Technical documentation
  - API documentation
  - Test case development
  - Quality assurance

### Acknowledgments

- **Technologies**: React, Flask, MySQL, Chart.js
- **Libraries**: All open-source libraries used in this project
- **Resources**: Online tutorials, documentation, and community support
- **Inspiration**: Modern productivity applications and wellness platforms

---

## Frequently Asked Questions (FAQ)

### General Questions

**Q: Is Life Dashboard free to use?**  
A: Yes, Life Dashboard is an academic project and is free to use.

**Q: Can I use this for commercial purposes?**  
A: Please check the license file for usage terms.

**Q: Is my data secure?**  
A: Yes, journal entries are encrypted, passwords are hashed, and we follow security best practices.

### Technical Questions

**Q: What browsers are supported?**  
A: Modern browsers including Chrome, Firefox, Safari, and Edge (latest versions).

**Q: Can I self-host Life Dashboard?**  
A: Yes, follow the installation and deployment guides in this README.

**Q: How do I backup my data?**  
A: Use MySQL backup tools (mysqldump) to export your database regularly.

**Q: Can I import existing data?**  
A: Currently, manual data import via SQL scripts is supported.

### Troubleshooting

**Q: Frontend can't connect to backend**  
A: Verify both servers are running and check CORS configuration in backend.

**Q: Database connection fails**  
A: Check MySQL service is running, credentials are correct, and database exists.

**Q: JWT token expired errors**  
A: Tokens expire after 24 hours. Log out and log back in to refresh.

**Q: Encryption errors on journal entries**  
A: Ensure ENCRYPTION_KEY is set correctly in environment variables.

---

## Roadmap

### Planned Features

#### Version 2.0
- [ ] Mobile applications (iOS/Android)
- [ ] Offline mode with synchronization
- [ ] Data export (CSV, PDF, JSON)
- [ ] Advanced analytics dashboard
- [ ] Goal setting and tracking
- [ ] Collaborative features (shared tasks/habits)
- [ ] Email/SMS notifications
- [ ] Third-party integrations (Google Calendar, etc.)

#### Version 2.5
- [ ] AI-powered insights and recommendations
- [ ] Voice input for journal entries
- [ ] Biometric authentication
- [ ] Multi-language support
- [ ] Customizable dashboard layouts
- [ ] Advanced data visualization
- [ ] Recurring tasks and habits
- [ ] Social features (friend connections)

#### Version 3.0
- [ ] Machine learning for habit prediction
- [ ] Natural language processing for journal analysis
- [ ] Sentiment analysis for mood tracking
- [ ] Predictive expense forecasting
- [ ] Gamification elements
- [ ] Achievement badges and rewards
- [ ] Community challenges
- [ ] API for third-party developers

---

## Changelog

### Version 1.0.0 (2025-12-14)

**Initial Release**

- Complete authentication system with JWT
- Task management with priorities and categories
- Habit tracking with streak calculation
- Encrypted journal entries
- Expense tracking with categorization
- Calendar with event management
- Pomodoro focus timer
- Dark/light theme support
- Responsive design for all devices
- User profile management
- Real-time data synchronization

**Security Enhancements**
- End-to-end encryption for journal entries
- Bcrypt password hashing
- JWT token-based authentication
- SQL injection prevention via ORM
- CORS configuration

**UI/UX Improvements**
- Pure black/white theme modes
- Glassmorphic design elements
- Smooth animations and transitions
- Notification system
- Loading states and error handling

---

## License

Copyright (c) 2025 ByteBuilders Team

This project is developed as part of an academic project at National University of Sciences and Technology (NUST).

### Academic Use

This software is provided for educational and research purposes. Students, educators, and researchers may use, modify, and distribute this software for non-commercial academic purposes.

### Terms

- Source code must be properly attributed
- Modifications should be documented
- Commercial use requires explicit permission
- No warranty is provided

For commercial licensing inquiries, please contact the project maintainers.

---

## Support

### Getting Help

**Documentation**
- Read this README thoroughly
- Check [QUICKSTART.md](QUICKSTART.md) for quick setup
- Review [SETUP.md](SETUP.md) for detailed instructions
- See [ENHANCEMENT_REPORT.md](ENHANCEMENT_REPORT.md) for feature details

**Issue Tracking**
- Search existing issues before creating new ones
- Use issue templates when available
- Provide detailed information
- Include error messages and screenshots

**Contact**

For questions, issues, or contributions:

- **GitHub Issues**: Create an issue in the repository
- **Email**: msarwar.bese23seecs@seecs.edu.pk
- **Documentation**: Project Documentation

### Response Times

- **Critical bugs**: 24-48 hours
- **Feature requests**: 1-2 weeks
- **General questions**: 2-5 business days
- **Pull requests**: Reviewed within 1 week

---

## Additional Resources

### Documentation

- [Quick Start Guide](QUICKSTART.md) - Get started in 5 minutes
- [Setup Guide](SETUP.md) - Detailed installation instructions
- [Enhancement Report](ENHANCEMENT_REPORT.md) - Feature documentation
- [API Documentation](#api-documentation) - Complete API reference

### External Resources

- [React Documentation](https://react.dev)
- [Flask Documentation](https://flask.palletsprojects.com)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org)
- [Vite Documentation](https://vitejs.dev)

### Community

- Star the repository to show support
- Watch for updates and announcements
- Fork to create your own version
- Contribute to make it better

---

<div align="center">

### Built with dedication by the ByteBuilders Team

**Life Dashboard** - Manage your life, one day at a time.

For bug reports, feature requests, and documentation, please contact the development team.

</div>

# Life Dashboard - Frontend

A comprehensive productivity dashboard built with React, Vite, and Tailwind CSS.

## Features

- 🔐 **Authentication** - Login, Register, Forgot Password
- 📊 **Dashboard** - Overview of all your productivity metrics
- ✅ **Tasks** - Task management system
- 🎯 **Habits** - Habit tracking with statistics
- 💰 **Expenses** - Expense tracking with charts and analytics
- 📅 **Calendar** - Calendar view for scheduling
- ⏱️ **Pomodoro Timer** - Focus timer for productivity
- 📝 **Journal** - Daily journaling
- ⚙️ **Settings** - User preferences and configurations

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Chart.js** - Data visualization

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
src/
├── api/                  # API communication
│   ├── axiosInstance.js
│   └── authApi.js
├── assets/              # Images and icons
├── components/          # Reusable UI components
├── context/             # React Context providers
├── hooks/               # Custom React hooks
├── layouts/             # Page layouts
├── pages/               # All application pages
│   ├── Auth/           # Login, Register, ForgotPassword
│   ├── Dashboard/      # Main dashboard
│   ├── Tasks/          # Task management
│   ├── Habits/         # Habit tracking
│   ├── Expenses/       # Expense tracking
│   ├── Calendar/       # Calendar view
│   ├── Pomodoro/       # Pomodoro timer
│   ├── Journal/        # Journaling
│   └── Settings/       # User settings
└── utils/              # Utility functions

```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Backend API

This frontend expects a backend API running on `http://localhost:5000/api`

Configure the API endpoint in `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

## Authentication Flow

1. User enters credentials on Login page
2. Request sent to `/api/auth/login`
3. Backend returns user data and sets httpOnly cookie
4. Frontend stores user in AuthContext
5. Protected routes check for authenticated user
6. Logout clears user from context and removes cookie

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Deployment

Build the production version:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## License

MIT

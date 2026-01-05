# Task Manager

A task management application built with React and Vite. Track your tasks, organize them with tags, monitor time spent, and view productivity analytics.

> **Note:** This repository contains only the frontend implementation. The backend server is a separate component and is not authored by me.

## Features

- Task creation, editing, and deletion
- Tag-based task organization
- Time tracking with start/pause/stop functionality
- Detailed summaries and statistics for selected time periods
- Clean and responsive user interface
- Data persistence using browser's local storage
- Real-time timer updates

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/UfukBC/Time-task-manager.git

# Navigate to project directory
cd Time-task-manager

# Install dependencies
npm install
```

### Running the Application

This application requires a backend server to function. The server should be placed in a separate directory.

**Backend Server (Not included in this repo):**
1. Place the server files in a separate directory
2. Navigate to server directory: `cd path/to/server`
3. Install server dependencies: `npm install`
4. Start the server: `node server.js` (runs on port 3010 by default)

**Frontend:**
```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

> **Important:** The backend server must be running on port 3010 before starting the frontend application.

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Usage

1. **Creating Tasks**: Click "Add New Task" button, enter task name, select tags, and save
2. **Starting Tasks**: Click the play button to start tracking time for a task
3. **Pausing/Stopping**: Use pause/stop buttons to control time tracking
4. **Managing Tags**: Open tag manager to create, edit, or delete tags
5. **Viewing Analytics**: Click "View Summary" to see detailed statistics for a time period
6. **Filtering**: Use the search bar to filter tasks by tag names

## Tech Stack

### Frontend (This Repository)
- **React 19** - JavaScript library for building user interfaces
- **Vite** - Next generation frontend tooling
- **React Router DOM** - Client-side routing for React
- **ESLint** - Code quality and style checking

### Backend (Separate - Not Included)
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **SQLite3** - File-based database
- **CORS** - Cross-origin resource sharing

## Project Structure

```
my-app/
├── src/
│   ├── pages/
│   │   ├── Home.jsx     - Landing page with welcome message
│   │   ├── About.jsx    - Information about the application
│   │   └── Tasks.jsx    - Main task management interface
│   ├── App.jsx          - Root component with routing
│   ├── main.jsx         - Application entry point
│   └── *.css            - Styling files
├── public/              - Static assets
└── index.html           - HTML template
```

## Key Features Explained

### Time Tracking
Each task can track active time with precision. The timer updates in real-time and persists across browser sessions.

### Tag System
Create custom tags with colors to categorize your tasks. Filter tasks by multiple tags simultaneously.

### Analytics Dashboard
View comprehensive statistics including:
- Total tasks and completion status
- Time spent per task
- Tag distribution
- Task completion trends

## Backend Server

The backend server is **NOT** authored by me and is provided separately. It includes:
- RESTful API endpoints for task and tag management
- SQLite database for data persistence
- CORS enabled for local development

For backend setup instructions, refer to the server's README file.

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome.

## Author

Frontend developed by [UfukBC](https://github.com/UfukBC)

Backend: Third-party component (Author: TJH)

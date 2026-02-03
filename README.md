# TaskPilot

A smart task management system with AI-powered task classification featuring a modern dashboard and user-based task isolation.

## 🔐 Security Notice

**All credentials have been removed and replaced with placeholders.**  
Environment variables are managed via `.env` files which are **not committed** to version control.

- MongoDB credentials have been rotated
- `.env.example` files provided for reference
- Git history has been cleaned of sensitive data

## Project Structure

```
TaskPilot/
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/      # MongoDB schemas
│   │   ├── controllers/ # Business logic
│   │   └── routes/      # API routes
├── frontend/             # Next.js frontend
│   └── taskpilot-frontend/
│       ├── app/         # Pages and routes
│       └── components/  # Reusable components
├── ai-service/           # Python Flask AI service
└── README.md
```

## Features

### ✅ Completed Features

**Frontend (Next.js 16.1.6 with Turbopack)**
- 🎨 Modern three-column dashboard layout (Today, Tomorrow, Overdue)
- 📊 Analytics dashboard with real-time task metrics
- 🤖 AI-powered auto-categorization with one-click classification
- ✏️ Full CRUD operations (Create, Read, Update, Delete)
- 👤 User-based task isolation with email-based authentication
- 🎯 Date-based task grouping and filtering
- 💫 Smooth micro-animations and hover effects
- 📱 Responsive design with mobile support
- 🎨 Semantic color coding (Blue=Today, Yellow=Tomorrow, Red=Overdue)
- ⚡ Loading states and error handling

**Backend (Node.js + Express)**
- RESTful API for task management
- MongoDB integration with Mongoose
- User-based task filtering by email
- AI service integration for task classification
- CORS enabled for frontend communication
- Comprehensive error handling and validation
- Health check endpoints

**AI Service (Python + Flask)**
- Keyword-based task classification
- Priority prediction (high/medium/low)
- Status prediction (todo/progress/done)
- Confidence scoring
- RESTful API with CORS support

**Database (MongoDB Atlas)**
- Cloud-hosted database
- User email-based task ownership
- Automatic timestamps
- Data validation and schema enforcement

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- Python 3.12+
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create `.env` file from template:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your MongoDB credentials
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
```

**⚠️ Important:** 
- Replace `<username>`, `<password>`, `<cluster-url>`, and `<database>` with your actual MongoDB Atlas credentials
- Never commit the `.env` file to version control
- The `.env` file is already in `.gitignore`

Start the development server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. AI Service Setup

Navigate to the ai-service directory:
```bash
cd ai-service
```

Create and activate a virtual environment:
```bash
python -m venv venv

# On Windows:
.\venv\Scripts\Activate.ps1

### 3. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend/taskpilot-frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

### Quick Start (All Services)

For convenience, use the batch script (Windows):
```bash
start-services.bat
```

Or start manually in separate terminals:
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - AI Service
cd ai-service && python app.py

# Terminal 3 - Frontend
cd frontend/taskpilot-frontend && npm run dev
```

## 🤖 AI Task Classifier

A lightweight NLP-based classifier that predicts task priority and status using **keyword heuristics with confidence scoring**.

**How it works:**
- Analyzes task descriptions for priority keywords (urgent, ASAP, important, etc.)
- Returns priority (high/medium/low) and status (todo/in-progress/done)
- Provides confidence score (0-1) based on keyword match strength
- Explains reasoning with detected keywords

**Key Features:**
- ✅ No external ML APIs required
- ✅ Fast inference (<100ms)
- ✅ Explainable predictions with confidence metrics
- ✅ Keyword-based heuristics optimized for task management

This approach demonstrates **practical ML integration** without over-engineering, making it ideal for hackathons and interview projects.

## API Endpoints**AI Classification**: Enter description and click "🤖 Auto-Categorize" to auto-fill priority/status
5. **Edit Task**: Click "Edit" button on any task card
6. **Delete Task**: Click "Delete" button with confirmation
7. **Analytics**: View real-time metrics at the top of dashboard
1. Navigate to the frontend directory:
```bash
cd frontend/taskpilot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Running All Services

Open three separate terminals and run:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - AI Service:**
```bash
cd ai-service
python app.py
```

**Terminal 3 - Frontend:**
```bash
cd frontend/taskpilot-frontend
npm run dev
```

## API Endpoints

### Backend (Port 5000)
- `Key Features Explained

### Three-Column Dashboard
Tasks are automatically organized into three visual columns:
- **Today** (Blue): Tasks due today
- **Tomorrow** (Yellow): Tasks due tomorrow  
- **Overdue** (Red): Past due tasks requiring attention

### User Isolation
Each user's tasks are completely isolated:
- Tasks are stored with `userEmail` field
- Backend filters queries by user email
- No user can see another user's tasks

### AI Classification
The AI service analyzes task descriptions for keywords:
- "urgent", "asap", "important" → High priority
- "later", "eventually", "someday" → Low priority
- "done", "finished", "completed" → Done status
- Returns confidence score with prediction

## Development Roadmap

### ✅ Phase 1 - Complete
- Backend API with MongoDB
- AI classification service
- Frontend UI with three-column layout
- Full CRUD operations
- User-based task isolation
- Analytics dashboard

### 🚧 Phase 2 - Future Enhancements
- Real authentication (JWT)
- Task sharing and collaboration
- Advanced AI models (ML-based)
- Real-time updates (WebSocket)
- Task notifications
- Dark mode
- Mobile app

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Contact

Repository: [https://github.com/abhijithk-ak/TaskPilot](https://github.com/abhijithk-ak/TaskPilot)
sk management
- MongoDB integration with Mongoose
- AI-powered task classification
- CORS enabled for frontend integration
### Test AI Classification:
```bash
curl -X POST http://localhost:8000/predict -H "Content-Type: application/json" -d "{\"description\": \"Finish this urgently\"}"
```

### Create a Task:
```bash
curl -X POST http://localhost:5000/tasks -H "Content-Type: application/json" -d "{\"title\": \"Test Task\", \"description\": \"This is urgent\", \"userEmail\": \"test@example.com\", \"priority\": \"high\", \"status\": \"todo\", \"dueDate\": \"2026-02-03\"}"
```

### Get User's Tasks:
```bash
curl "http://localhost:5000/tasks?userEmail=test@example.com"
```

## Technologies Used

- **Frontend**: Next.js 16.1.6 (Turbopack), React, TypeScript
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Axios
- **AI Service**: Python 3.12, Flask, Flask-CORS
- **Database**: MongoDB Atlas (Cloud)
- **Version Control**: Git, GitHub

## Architecture

```
┌─────────────┐      HTTP      ┌─────────────┐      HTTP      ┌─────────────┐
│   Frontend  │────────────────>│   Backend   │────────────────>│ AI Service  │
│  (Next.js)  │<────────────────│  (Express)  │<────────────────│   (Flask)   │
│  Port 3000  │                 │  Port 5000  │                 │  Port 8000  │
└─────────────┘                 └──────┬──────┘                 └─────────────┘
                                       │
                                       │ MongoDB Driver
                                       ▼
                                ┌─────────────┐
                                │  MongoDB    │
                                │   Atlas     │
                                └─────────────┘
```

## Key Features Explained

### Three-Column Dashboard
Tasks are automatically organized into three visual columns:
- **Today** (Blue): Tasks due today
- **Tomorrow** (Yellow): Tasks due tomorrow  
- **Overdue** (Red): Past due tasks requiring attention

### User Isolation
Each user's tasks are completely isolated:
- Tasks are stored with `userEmail` field
- Backend filters queries by user email
- No user can see another user's tasks

### AI Classification
The AI service analyzes task descriptions for keywords:
- "urgent", "asap", "important" → High priority
- "later", "eventually", "someday" → Low priority
- "done", "finished", "completed" → Done status
- Returns confidence score with prediction

✅ Backend API - Complete  
✅ AI Service - Complete  
🚧 Frontend - Coming Tomorrow  
🚧 Integration - Coming Tomorrow  

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Service**: Python, Flask, Flask-CORS
- **Frontend**: Next.js (coming soon)
- **Database**: MongoDB
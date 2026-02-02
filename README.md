# TaskPilot

A smart task management system with AI-powered task classification.

## Project Structure

```
TaskPilot/
├── backend/          # Node.js + Express API
├── frontend/         # Next.js frontend (coming soon)
├── ai-service/       # Python Flask AI service
└── README.md
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### AI Service Setup

1. Navigate to the ai-service directory:
```bash
cd ai-service
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\Activate.ps1
# On macOS/Linux:
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the Flask service:
```bash
python app.py
```

The AI service will run on `http://localhost:8000`

## API Endpoints

### Backend (Port 5000)
- `GET /health` - Health check
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `POST /tasks/classify` - Classify task using AI

### AI Service (Port 8000)
- `GET /health` - Health check
- `POST /predict` - Predict task priority and status

## Features

### ✅ Implemented
- RESTful API for task management
- MongoDB integration with Mongoose
- AI-powered task classification
- CORS enabled for frontend integration
- Error handling and validation
- Health check endpoints

### 🚧 Coming Soon
- Next.js frontend
- User authentication
- Task filtering and search
- Real-time updates
- Enhanced AI models

## Testing

You can test the API endpoints using tools like Postman or curl:

### Test AI Classification:
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"description": "Finish this urgently"}'
```

### Create a Task:
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "description": "This is urgent"}'
```

## Development Status

✅ Backend API - Complete  
✅ AI Service - Complete  
🚧 Frontend - Coming Tomorrow  
🚧 Integration - Coming Tomorrow  

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Service**: Python, Flask, Flask-CORS
- **Frontend**: Next.js (coming soon)
- **Database**: MongoDB
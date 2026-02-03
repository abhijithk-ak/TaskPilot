# TaskPilot ✨

> **AI-Powered Task Management System** with intelligent prioritization, smart navigation, and production-grade UX

A modern, full-stack task management application featuring AI-powered task classification, priority-based insights, and a polished dashboard interface that adapts to your workflow.

---

## 🎯 Project Highlights

### ✅ **Production-Ready Features**
- 🤖 **AI Task Classification** - Auto-categorize tasks with confidence scoring
- 📊 **Smart Dashboard** - Priority-based AI insights that adapt to task state
- 🎨 **Four-Column Layout** - Today → Tomorrow → Overdue → Upcoming
- ⚡ **Intelligent Navigation** - Context-aware scrolling and state management
- 📱 **Responsive Design** - Mobile-optimized with smooth animations
- 👤 **User Isolation** - Email-based task ownership and filtering
- 🔄 **Real-time Updates** - Instant task synchronization across all views

### 🧠 **UX Principles Applied**
- **Priority-based AI insights** (Overdue > Active > Completed > Empty)
- **State-aware navigation** (no surprise scrolling, predictable toggles)
- **Smooth animations** (requestAnimationFrame, pure CSS, zero blinks)
- **Modal state management** (pristine state on every open)
- **Visual feedback** (green pulse highlights, chevron rotation, hover states)

---

## 🏗️ Architecture

```
┌─────────────────┐      HTTP      ┌──────────────────┐      HTTP      ┌──────────────────┐
│   Frontend      │────────────────>│   Backend        │────────────────>│   AI Service     │
│   (Next.js)     │<────────────────│   (Express)      │<────────────────│   (Flask)        │
│   Port 3000     │   REST API      │   Port 5000      │   Classify API  │   Port 8000      │
│                 │                 │                  │                 │                  │
│ • Dashboard     │                 │ • Task CRUD      │                 │ • NLP Classifier │
│ • Task Cards    │                 │ • User Filter    │                 │ • Confidence     │
│ • AI Insights   │                 │ • AI Integration │                 │ • Explainability │
└─────────────────┘                 └────────┬─────────┘                 └──────────────────┘
                                             │
                                             │ MongoDB Driver
                                             ▼
                                    ┌──────────────────┐
                                    │   MongoDB Atlas  │
                                    │   (Cloud DB)     │
                                    └──────────────────┘
```

---

## 📂 Project Structure

```
TaskPilot/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── models/            # MongoDB schemas (Task model)
│   │   ├── controllers/       # Business logic
│   │   └── routes/            # API routes
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # Next.js 16.1.6 (Turbopack)
│   └── taskpilot-frontend/
│       ├── app/
│       │   ├── dashboard/     # Main dashboard page
│       │   ├── login/         # Login page
│       │   └── globals.css    # Global styles + animations
│       ├── components/
│       │   ├── TaskCard.tsx   # Task card component
│       │   └── CreateTaskModal.tsx  # Modal with AI integration
│       └── package.json
│
├── ai-service/                 # Python Flask AI Service
│   ├── app.py                 # Flask server
│   ├── classifier.py          # NLP task classifier
│   └── requirements.txt
│
└── README.md                   # You are here
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v18+ ([Download](https://nodejs.org/))
- **Python** 3.12+ ([Download](https://www.python.org/))
- **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
- **Git** ([Download](https://git-scm.com/))

### 1️⃣ Clone Repository
```bash
git clone https://github.com/abhijithk-ak/TaskPilot.git
cd TaskPilot
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install

# Create .env file from template
cp .env.example .env

# Edit .env and add your MongoDB credentials:
# MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/taskpilot?retryWrites=true&w=majority

# Start backend server
npm run dev
```
✅ Backend running on **http://localhost:5000**

### 3️⃣ AI Service Setup
```bash
cd ../ai-service

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\Activate.ps1

# Activate (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
python app.py
```
✅ AI Service running on **http://localhost:8000**

### 4️⃣ Frontend Setup
```bash
cd ../frontend/taskpilot-frontend
npm install

# Start development server
npm run dev
```
✅ Frontend running on **http://localhost:3000**

### 🎉 Access Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎨 Features Walkthrough

### 📊 **Dashboard Layout**

**Four Dynamic Columns:**
- 🔵 **Today** - Active + completed tasks due today (blue gradient)
- 🟡 **Tomorrow** - Tasks due tomorrow (yellow gradient)
- 🔴 **Overdue** - Past due tasks requiring attention (red gradient)
- 🟣 **Upcoming** - Future tasks (purple gradient)

**Adaptive Layout:**
- Columns appear/disappear based on task availability
- Grid auto-adjusts (2-4 columns based on content)
- Mobile-responsive with single-column fallback

### 🤖 **AI Productivity Insights**

**Priority-Based Intelligence:**
```
1️⃣ Overdue tasks exist     → ⚠️ Warning tone (red)
                              "You have 3 overdue tasks..."

2️⃣ Active tasks today      → 🎯 Focus tone (blue)
                              "Peak hours: 10-12 PM. Focus on..."

3️⃣ Today complete          → 🎉 Success tone (green)
                              "Great work! All tasks completed..."

4️⃣ No tasks                → 💡 Neutral tone (gray)
                              "Clean slate! Add tasks..."
```

### 🎯 **Smart Completed Navigation**

**Context-Aware Scrolling:**
- Archive has items → Scroll to archive + expand + highlight
- Archive empty + today completed → Scroll to Today section
- No completed tasks → Show helpful message
- Toggle behavior → Collapse if already open (no surprise scrolling)

### ✨ **AI Task Categorization**

1. Enter task description
2. Click **"🤖 Auto-Categorize"**
3. AI analyzes keywords and context
4. Auto-fills priority (High/Medium/Low) and status
5. Shows confidence score with explanation

**Example:**
```
Description: "Finish urgent presentation for tomorrow's meeting"

AI Result:
✅ Priority: High
✅ Status: Todo
✅ Confidence: 85%
✅ Reason: "Detected keywords: urgent, tomorrow, meeting"
```

### 🎨 **Visual Polish**

- **Header gradient** - Subtle blue tint (#f8fbff → #f4f7fb)
- **Progress bar** - Always visible with contextual messages
- **Hover states** - Green pill backgrounds on interactive elements
- **Animations** - Smooth scrolling, chevron rotation, pulse highlights
- **Success pulse** - Green glow on Today column when 100% complete

### 📋 **Completed Archive**

- Shows only completed tasks from **previous days**
- Today's completed tasks stay in Today column
- Click to expand individual task details
- Accordion behavior (one card open at a time)
- Chevron rotation indicates expand/collapse state

---

## 🛠️ Technologies

### Frontend Stack
- **Next.js 16.1.6** (Turbopack) - React framework with server-side rendering
- **React 19** - Component library
- **TypeScript** - Type safety
- **Lucide React** - Icon library
- **CSS Modules** - Scoped styling with animations

### Backend Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database (Atlas cloud)
- **Mongoose** - ODM (Object Document Mapper)
- **Axios** - HTTP client for AI service integration

### AI Service Stack
- **Python 3.12** - Programming language
- **Flask** - Lightweight web framework
- **Flask-CORS** - Cross-origin resource sharing
- **NLP Classifier** - Keyword-based task categorization

---

## 📡 API Reference

### Backend Endpoints (Port 5000)

#### **Tasks**
```http
GET    /tasks?userEmail={email}     # Get all user tasks
POST   /tasks                       # Create new task
PUT    /tasks/:id                   # Update task
DELETE /tasks/:id                   # Delete task
POST   /tasks/classify              # AI classification
```

#### **Health Check**
```http
GET    /health                      # Server status
```

### AI Service Endpoints (Port 8000)

#### **Prediction**
```http
POST   /predict
Content-Type: application/json

{
  "description": "Finish urgent presentation for tomorrow"
}

Response:
{
  "priority": "high",
  "status": "todo",
  "confidence": 0.85,
  "reason": "Detected keywords: urgent, tomorrow, finish"
}
```

---

## 🧪 Testing

### Manual Testing

**Test AI Classification:**
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"description": "Urgent meeting tomorrow"}'
```

**Create Task:**
```bash
curl -X POST http://localhost:5000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is urgent",
    "userEmail": "test@example.com",
    "priority": "high",
    "status": "todo",
    "dueDate": "2026-02-03"
  }'
```

**Get User Tasks:**
```bash
curl "http://localhost:5000/tasks?userEmail=test@example.com"
```

---

## 🔐 Security

### Environment Variables
- `.env` files are **never committed** to version control
- MongoDB credentials stored securely in `.env`
- `.env.example` provided as template
- Git history cleaned of sensitive data

### User Isolation
- Tasks filtered by `userEmail` field
- No cross-user data leakage
- Backend enforces user-based queries

---

## 📈 Development Roadmap

### ✅ Phase 1 - Complete
- [x] Backend REST API with MongoDB
- [x] AI classification service with confidence scoring
- [x] Next.js frontend with Turbopack
- [x] Four-column dashboard layout
- [x] AI productivity insights (priority-based)
- [x] Smart completed navigation
- [x] Task CRUD operations
- [x] User isolation by email
- [x] Modal state management
- [x] Smooth animations and micro-interactions
- [x] Completed archive with accordion
- [x] Responsive design

### 🚧 Phase 2 - Future Enhancements
- [ ] JWT authentication
- [ ] Task collaboration (sharing/comments)
- [ ] Real-time updates (WebSocket)
- [ ] Push notifications
- [ ] Dark mode toggle
- [ ] Advanced ML models (BERT/GPT)
- [ ] Calendar view
- [ ] Task templates
- [ ] Export/Import (CSV/JSON)
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** your feature branch
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit** your changes
   ```bash
   git commit -m 'feat: add AmazingFeature'
   ```
4. **Push** to the branch
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open** a Pull Request

### Commit Message Convention
```
feat: add new feature
fix: bug fix
docs: documentation update
style: formatting, no code change
refactor: code restructuring
test: add tests
chore: maintenance
```

---

## 📄 License

This project is open source and available under the **MIT License**.

---

## 📞 Contact

**Repository:** [github.com/abhijithk-ak/TaskPilot](https://github.com/abhijithk-ak/TaskPilot)

**Issues:** [github.com/abhijithk-ak/TaskPilot/issues](https://github.com/abhijithk-ak/TaskPilot/issues)

---

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing Turbopack compiler
- **MongoDB Atlas** - For free cloud database hosting
- **Lucide Icons** - For beautiful, customizable icons
- **Flask** - For lightweight Python web framework

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ for better productivity

</div>

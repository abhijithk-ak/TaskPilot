<div align="center">

<!-- Animated Premium SVG Banner -->
<svg viewBox="0 0 800 220" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; max-width: 800px; height: auto; border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.15); margin-bottom: 20px;">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;500&display=swap');
    
    .title-text {
      font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
      font-weight: 800;
      font-size: 52px;
      fill: url(#text-gradient);
      animation: title-glow 3s ease-in-out infinite alternate;
    }
    
    .subtitle-text {
      font-family: 'Inter', -apple-system, sans-serif;
      font-weight: 500;
      font-size: 18px;
      fill: #94a3b8;
    }
    
    .badge-rect {
      fill: rgba(255, 255, 255, 0.05);
      stroke: rgba(255, 255, 255, 0.1);
      stroke-width: 1;
      rx: 6px;
    }

    .badge-text {
      font-family: 'Inter', -apple-system, sans-serif;
      font-weight: 600;
      font-size: 11px;
      fill: #cbd5e1;
    }
    
    .grid-pattern {
      stroke: rgba(99, 102, 241, 0.07);
      stroke-width: 1;
    }
    
    .floating-node {
      animation: float-around 8s ease-in-out infinite;
    }
    
    .node-delay-1 { animation-delay: -2s; }
    .node-delay-2 { animation-delay: -4s; }
    .node-delay-3 { animation-delay: -6s; }
    
    .pulse-ring-element {
      transform-origin: 670px 110px;
      animation: pulse-ring 4s cubic-bezier(0.25, 0, 0, 1) infinite;
    }

    .pulse-dot-element {
      transform-origin: 670px 110px;
      animation: pulse-dot 2s ease-in-out infinite alternate;
    }
    
    @keyframes title-glow {
      0% {
        filter: drop-shadow(0 0 2px rgba(99, 102, 241, 0.3)) drop-shadow(0 0 5px rgba(99, 102, 241, 0.1));
      }
      100% {
        filter: drop-shadow(0 0 12px rgba(168, 85, 247, 0.6)) drop-shadow(0 0 25px rgba(236, 72, 153, 0.2));
      }
    }
    
    @keyframes float-around {
      0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
      33% { transform: translateY(-12px) translateX(8px) rotate(5deg); }
      66% { transform: translateY(6px) translateX(-10px) rotate(-5deg); }
    }
    
    @keyframes pulse-ring {
      0% { r: 8px; opacity: 0.8; stroke-width: 3; }
      100% { r: 45px; opacity: 0; stroke-width: 1; }
    }

    @keyframes pulse-dot {
      0% { r: 6px; fill: #6366f1; filter: drop-shadow(0 0 2px #6366f1); }
      100% { r: 9px; fill: #ec4899; filter: drop-shadow(0 0 8px #ec4899); }
    }
  </style>

  <defs>
    <!-- Deep premium dark background gradient -->
    <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    
    <!-- Text glowing gradient -->
    <linearGradient id="text-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#818cf8" />
      <stop offset="35%" stop-color="#c084fc" />
      <stop offset="70%" stop-color="#f472b6" />
      <stop offset="100%" stop-color="#fb7185" />
    </linearGradient>
    
    <!-- Pulse gradient -->
    <radialGradient id="pulse-grad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="1" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Background Layer -->
  <rect width="100%" height="100%" rx="12" fill="url(#bg-gradient)" />
  
  <!-- Subtle High-tech Grid -->
  <path class="grid-pattern" d="M 0,30 L 800,30 M 0,60 L 800,60 M 0,90 L 800,90 M 0,120 L 800,120 M 0,150 L 800,150 M 0,180 L 800,180 M 50,0 L 50,220 M 100,0 L 100,220 M 150,0 L 150,220 M 200,0 L 200,220 M 250,0 L 250,220 M 300,0 L 300,220 M 350,0 L 350,220 M 400,0 L 400,220 M 450,0 L 450,220 M 500,0 L 500,220 M 550,0 L 550,220 M 600,0 L 600,220 M 650,0 L 650,220 M 700,0 L 700,220 M 750,0 L 750,220" />

  <!-- Animated Radar Pulse (Right Side Component) -->
  <circle cx="670" cy="110" r="10" fill="none" stroke="url(#text-gradient)" class="pulse-ring-element" />
  <circle cx="670" cy="110" class="pulse-dot-element" />

  <!-- Floating Abstract Particles / Nodes -->
  <circle class="floating-node node-delay-1" cx="120" cy="60" r="5" fill="#818cf8" opacity="0.6" />
  <circle class="floating-node node-delay-2" cx="720" cy="50" r="7" fill="#f472b6" opacity="0.5" />
  <circle class="floating-node node-delay-3" cx="140" cy="160" r="4" fill="#c084fc" opacity="0.7" />
  <circle class="floating-node node-delay-1" cx="580" cy="170" r="6" fill="#fb7185" opacity="0.4" />
  
  <!-- Main Title & Tagline -->
  <text x="50" y="105" class="title-text">TaskPilot ✨</text>
  <text x="52" y="145" class="subtitle-text">AI-Powered Task Management System with Production-Grade UX</text>

  <!-- Badges inside SVG -->
  <g transform="translate(52, 168)">
    <rect width="90" height="22" class="badge-rect" />
    <text x="45" y="15" text-anchor="middle" class="badge-text">🤖 NLP CLASSIFIER</text>
  </g>
  <g transform="translate(150, 168)">
    <rect width="80" height="22" class="badge-rect" />
    <text x="40" y="15" text-anchor="middle" class="badge-text">⚡ NEXT.JS 16</text>
  </g>
  <g transform="translate(238, 168)">
    <rect width="80" height="22" class="badge-rect" />
    <text x="40" y="15" text-anchor="middle" class="badge-text">🍃 MONGODB</text>
  </g>
</svg>

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

A modern, full-stack task management application featuring **AI-powered task classification**, **priority-based insights**, and a **polished dashboard interface** that adapts dynamically to your lifestyle.

[Explore Demo](#-features-walkthrough) • [Quick Start](#-quick-start) • [API Docs](#-api-reference) • [UX Philosophy](#-ux-principles-applied)

</div>

---

## 🎯 Project Highlights

### ✅ Production-Ready Features
*   🤖 **AI Task Classification** - Auto-categorize tasks with confidence scoring & reasoning.
*   📊 **Smart Dashboard** - Priority-based AI insights that adapt dynamically to task state.
*   🔐 **User Authentication** - Secure sign-up, login, profile updates, and password resets using robust **bcryptjs** hashing.
*   🎨 **Four-Column Layout** - Streamlined categorization: `Today` ➔ `Tomorrow` ➔ `Overdue` ➔ `Upcoming`.
*   ⚡ **Intelligent Navigation** - Context-aware scrolling, section highlighting, and smart collapses.
*   📱 **Responsive Design** - Mobile-optimized layouts with butter-smooth micro-animations.
*   👤 **User Isolation** - Multi-tenant isolation ensuring users only access their personal tasks.
*   🔄 **Instant UI Sync** - State-driven updates reflected immediately without annoying page reloads.

### 🧠 UX Principles Applied
*   **Priority-based AI insights** (Overdue > Active > Completed > Empty)
*   **State-aware navigation** (no surprise scrolling, predictable toggle animations)
*   **Zero-blink transitions** (pure CSS transitions + `requestAnimationFrame`)
*   **Pristine Modal state management** (full resets on opening to prevent stale data)
*   **High-fidelity visual feedback** (green pulse highlights, chevron rotations, interactive hover states)

---

## 🔎 Quick Navigation
*   [🏗️ Architecture](#️-architecture)
*   [📂 Project Structure](#-project-structure)
*   [🚀 Quick Start](#-quick-start)
*   [🎨 Features Walkthrough](#-features-walkthrough)
*   [🤖 AI Task Categorization](#-ai-task-categorization)
*   [📡 API Reference](#-api-reference)
*   [🧪 Testing](#-testing)
*   [🛡️ Security Analysis](#️-security-analysis)
*   [📈 Development Roadmap](#-development-roadmap)

---

## 🏗️ Architecture

```
┌─────────────────┐      HTTP      ┌──────────────────┐      HTTP      ┌──────────────────┐
│   Frontend      │────────────────>│   Backend        │────────────────>│   AI Service     │
│   (Next.js)     │<────────────────│   (Plain Node)   │<────────────────│   (Flask)        │
│   Port 3000     │   REST API      │   Port 5000      │   Classify API  │   Port 8000      │
│                 │                 │                  │                 │                  │
│ • Dashboard     │                 │ • Task CRUD      │                 │ • NLP Classifier │
│ • Auth Interface│                 │ • User Profile   │                 │ • Confidence     │
│                 │                 │                  │                 │ • Explainability │
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
├── backend/                    # Node.js REST API (Plain HTTP Server, No Express)
│   ├── src/
│   │   ├── models/            # MongoDB Schemas (Task, User)
│   │   ├── controllers/       # Business Controllers (task, user)
│   │   ├── utils/             # Helper utilities (HTTP parsers, CORS headers)
│   │   └── router.js          # Custom lightweight HTTP router
│   ├── .env.example           # Environment template
│   └── package.json
│
├── frontend/                   # Next.js 16.1.6 (Turbopack layout directly at root)
│   ├── app/                   # Dashboard, login, register, and page layouts
│   ├── components/            # Task card components, task modals, register helpers
│   ├── contexts/              # Authentication & global application state
│   ├── utils/                 # Frontend helpers (API handlers, browser storage)
│   └── package.json
│
├── ai-service/                 # Python Flask AI Service
│   ├── app.py                 # Flask server
│   ├── classifier.py          # NLP task classifier
│   └── requirements.txt
│
├── start-services.bat          # Windows helper to start all services
├── test_services.py            # Service connectivity tester
└── README.md                   # You are here
```

### 📄 Utility Scripts
*   [`start-services.bat`](file:///d:/TaskPilot/start-services.bat) - Windows batch script to launch all three services simultaneously *(Windows only)*
*   [`test_services.py`](file:///d:/TaskPilot/test_services.py) - Python script to verify backend, frontend, and AI service connectivity

---

## 🚀 Quick Start

### Prerequisites
*   **Node.js** v18+ ([Download](https://nodejs.org/))
*   **Python** 3.12+ ([Download](https://www.python.org/))
*   **MongoDB Atlas** account ([Sign up free](https://www.mongodb.com/cloud/atlas))
*   **Git** ([Download](https://git-scm.com/))

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
👉 Backend running on **http://localhost:5000**

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
👉 AI Service running on **http://localhost:8000**

### 4️⃣ Frontend Setup
```bash
cd ../frontend
npm install

# Start development server
npm run dev
```
👉 Frontend running on **http://localhost:3000**

### 🎉 Access Application
Open your browser and navigate to:
```
http://localhost:3000
```

---

## 🎨 Features Walkthrough

### 📊 Dashboard Layout

**Four Dynamic Columns:**
*   🔵 **Today** - Active + completed tasks due today (blue gradient highlight)
*   🟡 **Tomorrow** - Tasks due tomorrow (yellow gradient highlight)
*   🔴 **Overdue** - Past due tasks requiring attention (red gradient highlight)
*   🟣 **Upcoming** - Future tasks (purple gradient highlight)

**Adaptive Layout:**
*   Columns automatically appear/disappear based on task availability.
*   Grid auto-adjusts layout dynamically (2-4 columns based on current content).
*   Fully mobile-responsive with single-column layout transitions.

### 🤖 AI Productivity Insights

**Priority-Based Intelligence Engine:**

```
1️⃣ Overdue tasks exist     ➔ ⚠️ Warning tone (Red alert styling)
                               "You have 3 overdue tasks..."

2️⃣ Active tasks today      ➔ 🎯 Focus tone (Blue accent styling)
                               "Peak hours: 10-12 PM. Focus on..."

3️⃣ Today complete          ➔ 🎉 Success tone (Green accent styling)
                               "Great work! All tasks completed..."

4️⃣ No tasks                ➔ 💡 Neutral tone (Slate/gray styling)
                               "Clean slate! Add tasks..."
```

---

## 📡 API Reference

### Backend Endpoints (Port 5000)

#### User Authentication API
```http
POST   /auth/register               # Sign up a new user (with password hashing)
POST   /auth/login                  # Log in and check credentials
POST   /auth/reset-password         # Reset account password
GET    /auth/profile?email={email}  # Retrieve user profile & settings
PUT    /auth/profile                # Update name & custom preferences
```

#### Tasks API
```http
GET    /tasks?userEmail={email}     # Fetch all tasks scoped to email
POST   /tasks                       # Create a new task
PUT    /tasks/:id                   # Update an existing task
DELETE /tasks/:id                   # Delete a task
POST   /tasks/classify              # AI Task classification
```

---

## 🛡️ Security Analysis

Before committing and pushing this codebase to public Git repositories, please review the security audit checklist below:

### 🚨 Vulnerability Highlights

1.  **Missing Authentication/Authorization Middleware**:
    *   *Observation*: The custom backend routing structure processes data operations (e.g., retrieving tasks) by matching parameters such as `?userEmail={email}` directly from query inputs. There is no active validation check like a JWT authorization header or session validation.
    *   *Mitigation*: Implement standard token-based validation (JWT signature checks) on routes mapping parameters other than `/auth/login` and `/auth/register`.
2.  **No Payload Size Limit (Potential Denial of Service)**:
    *   *Observation*: The manual `parseBody(req)` function inside `backend/src/utils/http.js` processes requests by continuously appending incoming chunks without restriction:
        ```javascript
        req.on('data', chunk => { data += chunk; });
        ```
    *   *Mitigation*: Implement a boundary check (e.g., limit incoming strings to `1MB` maximum size limit) to prevent memory exhaustion crashes.
3.  **Global CORS Policy**:
    *   *Observation*: The headers inside [`http.js`](file:///d:/TaskPilot/backend/src/utils/http.js) export `Access-Control-Allow-Origin: '*'` to all origins.
    *   *Mitigation*: Restrict cross-origin rules to production domains instead of using the wildcard parameter.

### 🔐 Git Push Safety
*   **Database Credentials**: Actual Database connections are pulled from `process.env.MONGODB_URI`. Make sure your active `backend/.env` file containing secrets is **never** committed to version control.
*   **Ignore Patterns**: The global [`.gitignore`](file:///d:/TaskPilot/.gitignore) contains rule blocks for `.env`, `node_modules/`, and `venv/`, ensuring standard build configs and secrets are safely ignored during `git add .` staging routines.

---

## 📈 Development Roadmap

### ✅ Phase 1 - Complete
*   [x] Plain Node.js HTTP Backend (no dependency overhead)
*   [x] AI classification service with Flask & NLP heuristics
*   [x] Flattened Next.js frontend setup running on Turbopack
*   [x] Password protection via **bcryptjs**
*   [x] Priority-based productivity insights
*   [x] State-driven task archiving system

---

## 🤝 Contributing

We welcome contributions! Here's how:

1.  **Fork** the repository
2.  **Create** your feature branch
    ```bash
    git checkout -b feature/AmazingFeature
    ```
3.  **Commit** your changes
    ```bash
    git commit -m 'feat: add AmazingFeature'
    ```
4.  **Push** to the branch
    ```bash
    git push origin feature/AmazingFeature
    ```
5.  **Open** a Pull Request

---

## 📄 License

This project is open source and available under the **MIT License**.

'use client';

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
    
    // Initialize with dummy tasks
    setTasks([
    {
      id: '1',
      title: 'Finish assignment',
      description: 'Complete TaskPilot UI',
      status: 'todo',
      priority: 'high',
      dueDate: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Prepare demo',
      description: 'Record demo video',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000).toISOString(), // tomorrow
    },
    {
      id: '3',
      title: 'Submit report',
      description: 'Upload README',
      status: 'todo',
      priority: 'low',
      dueDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
    },
    ]);
  }, []);

  if (!mounted) return null;

  // Date helper logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Group tasks
  const todayTasks = tasks.filter(task =>
    isSameDay(new Date(task.dueDate), today)
  );

  const tomorrowTasks = tasks.filter(task =>
    isSameDay(new Date(task.dueDate), tomorrow)
  );

  const overdueTasks = tasks.filter(task =>
    new Date(task.dueDate) < today
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <div style={{
        width: '220px',
        background: '#1f2937',
        color: 'white',
        padding: '20px'
      }}>
        <h2>TaskPilot</h2>
        <p style={{ fontSize: '12px', marginTop: '10px' }}>{userEmail}</p>

        <div style={{ marginTop: '30px' }}>
          <p>Dashboard</p>
          <p
            style={{ marginTop: '10px', cursor: 'pointer' }}
            onClick={() => {
              localStorage.removeItem('userEmail');
              window.location.href = '/';
            }}
          >
            Logout
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '30px', background: '#f8fafc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1>Dashboard</h1>
          <button 
            className="btn primary" 
            onClick={() => setShowModal(true)}
            style={{ padding: '10px 16px' }}
          >
            + Add Task
          </button>
        </div>

        <h2>📌 Today</h2>
        {todayTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        <h2 style={{ marginTop: '20px' }}>📅 Tomorrow</h2>
        {tomorrowTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}

        <h2 style={{ marginTop: '20px', color: 'red' }}>⚠️ Overdue</h2>
        {overdueTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <CreateTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={(task) => setTasks([...tasks, task])}
      />

    </div>
  );
}

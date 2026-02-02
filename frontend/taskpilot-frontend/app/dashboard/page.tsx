'use client';

import { useState, useEffect } from 'react';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
    
    // Fetch tasks from backend
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) return;
      
      const res = await fetch(`http://localhost:5000/tasks?userEmail=${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      // Initialize with dummy tasks if backend is not available
      setTasks([
        {
          _id: '1',
          title: 'Finish assignment',
          description: 'Complete TaskPilot UI',
          status: 'todo',
          priority: 'high',
          dueDate: new Date().toISOString(),
        },
        {
          _id: '2',
          title: 'Prepare demo',
          description: 'Record demo video',
          status: 'todo',
          priority: 'medium',
          dueDate: new Date(Date.now() + 86400000).toISOString(),
        },
        {
          _id: '3',
          title: 'Submit report',
          description: 'Upload README',
          status: 'todo',
          priority: 'low',
          dueDate: new Date(Date.now() - 86400000).toISOString(),
        },
      ]);
    }
  };

  const handleTaskCreated = (task: any) => {
    fetchTasks(); // Refresh to get updated list from server
  };

  const handleEdit = (task: any) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE'
      });
      fetchTasks(); // Refresh list
    } catch (err) {
      alert('Error deleting task');
      console.error(err);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  if (!mounted) return null;

  // Date helper logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Analytics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const activeTasks = tasks.filter(t => t.status === 'todo' || t.status === 'progress').length;
  const overdueCount = tasks.filter(
    t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'done'
  ).length;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Group tasks
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(new Date(task.dueDate), today);
  });

  const tomorrowTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isSameDay(new Date(task.dueDate), tomorrow);
  });

  const overdueTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < today;
  });

  const noDueDateTasks = tasks.filter(task => !task.dueDate);

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

        {/* Analytics Cards */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <div style={{ background: 'white', padding: '15px 20px', borderRadius: '8px', flex: '1', minWidth: '150px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3498db' }}>{totalTasks}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>📝 Total Tasks</div>
          </div>
          <div style={{ background: 'white', padding: '15px 20px', borderRadius: '8px', flex: '1', minWidth: '150px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f39c12' }}>{activeTasks}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>⏳ Active</div>
          </div>
          <div style={{ background: 'white', padding: '15px 20px', borderRadius: '8px', flex: '1', minWidth: '150px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#2ecc71' }}>{completedTasks}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>✅ Completed</div>
          </div>
          <div style={{ background: 'white', padding: '15px 20px', borderRadius: '8px', flex: '1', minWidth: '150px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#e74c3c' }}>{overdueCount}</div>
            <div style={{ fontSize: '13px', color: '#777', marginTop: '4px' }}>⚠️ Overdue</div>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="dashboard-grid">
          {/* Today Column */}
          <div className="task-column today-column">
            <div className="column-header">
              <h2>📌 Today</h2>
              <span className="task-count">{todayTasks.length}</span>
            </div>
            <div className="column-content">
              {todayTasks.length > 0 ? (
                todayTasks.map(task => (
                  <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <div className="empty-state">No tasks for today</div>
              )}
            </div>
          </div>

          {/* Tomorrow Column */}
          <div className="task-column tomorrow-column">
            <div className="column-header">
              <h2>📅 Tomorrow</h2>
              <span className="task-count">{tomorrowTasks.length}</span>
            </div>
            <div className="column-content">
              {tomorrowTasks.length > 0 ? (
                tomorrowTasks.map(task => (
                  <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <div className="empty-state">No tasks for tomorrow</div>
              )}
            </div>
          </div>

          {/* Overdue Column */}
          <div className="task-column overdue-column">
            <div className="column-header">
              <h2>⚠️ Overdue</h2>
              <span className="task-count">{overdueTasks.length}</span>
            </div>
            <div className="column-content">
              {overdueTasks.length > 0 ? (
                overdueTasks.map(task => (
                  <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))
              ) : (
                <div className="empty-state">All caught up! 🎉</div>
              )}
            </div>
          </div>
        </div>

        {/* No Due Date Section (Below Grid) */}
        {noDueDateTasks.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h2>📂 No Due Date ({noDueDateTasks.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px', marginTop: '12px' }}>
              {noDueDateTasks.map(task => (
                <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>

      <CreateTaskModal
        isOpen={showModal}
        onClose={handleModalClose}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
      />

    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, Pin, Calendar, AlertTriangle, Plus } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [tasks, setTasks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showCompleted, setShowCompleted] = useState(false);

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

  // Format current date
  const getFormattedDate = () => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    return `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  };

  if (!mounted) return null;

  // Separate active and completed tasks
  const activeTasksList = tasks.filter(t => t.status !== 'done');
  const completedTasksList = tasks.filter(t => t.status === 'done');

  // Date helper logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Analytics
  const totalTasks = tasks.length;
  const completedTasksCount = completedTasksList.length;
  const activeTasksCount = activeTasksList.length;
  const overdueCount = activeTasksList.filter(
    t => t.dueDate && new Date(t.dueDate) < today
  ).length;

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(today.getDate() + 2);

  // Priority ranking for sorting
  const priorityRank: Record<string, number> = {
    high: 1,
    medium: 2,
    low: 3
  };

  // Sort tasks by priority, due date, created time (no need for done check in active tasks)
  const sortTasks = (taskList: any[]) =>
    [...taskList].sort((a, b) => {
      // 1. Priority first
      if (priorityRank[a.priority] !== priorityRank[b.priority]) {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }

      // 2. Due date second (earlier first)
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }

      // 3. Created time as tie-breaker
      if (a.createdAt && b.createdAt) {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      return 0;
    });

  // Group active tasks with normalized dates
  const todayTasks = sortTasks(activeTasksList.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  }));

  // Today-specific metrics for completion percentage
  const todayCompletedTasks = completedTasksList.filter(task => {
    if (!task.dueDate) return 0;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  }).length;
  const totalTodayTasks = todayTasks.length + todayCompletedTasks;
  const todayCompletionPercentage = totalTodayTasks > 0 
    ? Math.round((todayCompletedTasks / totalTodayTasks) * 100) 
    : 0;

  const tomorrowTasks = sortTasks(activeTasksList.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === tomorrow.getTime();
  }));

  const overdueTasks = sortTasks(activeTasksList.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }));

  const upcomingTasks = sortTasks(activeTasksList.filter(task => {
    if (!task.dueDate) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due >= dayAfterTomorrow;
  }));

  const noDueDateTasks = sortTasks(activeTasksList.filter(task => !task.dueDate));

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      
      {/* Sidebar */}
      <div style={{
        width: '240px',
        background: '#1f2937',
        color: 'white',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Logo Section */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '8px'
          }}>
            <div style={{
              width: '42px',
              height: '42px',
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px'
            }}>
              ✓
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', letterSpacing: '-0.3px' }}>TaskPilot</h2>
              <p style={{ margin: 0, fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>AI Task Manager</p>
            </div>
          </div>
          
          <p style={{ fontSize: '12px', marginTop: '12px', color: '#9ca3af', paddingLeft: '4px' }}>{userEmail}</p>

          {/* Navigation */}
          <div style={{ marginTop: '30px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: '6px',
              background: 'rgba(59, 130, 246, 0.15)',
              borderLeft: '3px solid #3b82f6',
              fontWeight: '600',
              fontSize: '14px'
            }}>
              <LayoutDashboard size={18} /> Dashboard
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '8px',
                cursor: 'pointer',
                padding: '10px 12px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              onClick={() => {
                localStorage.removeItem('userEmail');
                window.location.href = '/';
              }}
            >
              <LogOut size={18} /> Logout
            </div>
          </div>
        </div>

        {/* Footer Version */}
        <div style={{
          fontSize: '11px',
          color: '#6b7280',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '12px',
          marginTop: '20px'
        }}>
          v1.0 • AI Task Manager
        </div>
      </div>

      {/* Main Content */}
      <div className="page-background" style={{ flex: 1, padding: '30px' }}>
        {/* Header with Date */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 600,
              letterSpacing: '-0.3px',
              margin: 0,
              color: '#111827',
              marginBottom: '6px'
            }}>
              Dashboard
            </h1>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0, fontWeight: 500 }}>
              {getFormattedDate()} · Focus on today's priorities
            </p>
          </div>
          <button 
            className="btn primary" 
            onClick={() => setShowModal(true)}
            style={{ padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={18} /> Add Task
          </button>
        </div>

        {/* Compact Insight Bar */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', fontSize: '14px', color: '#6b7280' }}>
            <span>
              Tasks: <strong style={{ color: '#3b82f6', fontWeight: 600 }}>{totalTasks}</strong> total
            </span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span>
              <strong style={{ color: '#f59e0b', fontWeight: 600 }}>{activeTasksCount}</strong> active
            </span>
            <span style={{ color: '#d1d5db' }}>·</span>
            <span 
              onClick={() => setShowCompleted(prev => !prev)}
              style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              <strong style={{ color: '#10b981', fontWeight: 600 }}>{completedTasksCount}</strong> completed {showCompleted ? '▼' : '▶'}
            </span>
            {overdueCount > 0 && (
              <>
                <span style={{ color: '#d1d5db' }}>·</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertTriangle size={14} style={{ color: '#ef4444' }} />
                  <strong style={{ color: '#ef4444', fontWeight: 600 }}>{overdueCount}</strong> overdue
                </span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {totalTodayTasks > 0 && (
              <>
                <div style={{ 
                  width: '120px', 
                  height: '6px', 
                  background: '#e5e7eb', 
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${todayCompletionPercentage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10b981, #3b82f6)',
                    borderRadius: '3px',
                    transition: 'width 0.3s ease'
                  }} />
                </div>
                <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap' }}>
                  {todayCompletionPercentage}% done today
                </span>
              </>
            )}
          </div>
        </div>

        {/* Four Column Layout - Reordered: Today → Tomorrow → Overdue → Upcoming */}
        <div className="dashboard-grid" style={{ 
          gridTemplateColumns: `repeat(${2 + (overdueTasks.length > 0 ? 1 : 0) + (upcomingTasks.length > 0 ? 1 : 0)}, 1fr)` 
        }}>
          {/* Today Column - Always Show */}
          <div className="task-column today-column">
            <div className="column-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Pin size={18} /> Today</h2>
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

          {/* Tomorrow Column - Always Show */}
          <div className="task-column tomorrow-column">
            <div className="column-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Tomorrow</h2>
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

          {/* Overdue Column - Show Only If Tasks Exist (Higher Priority) */}
          {overdueTasks.length > 0 && (
            <div className="task-column overdue-column">
              <div className="column-header">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={18} /> Overdue</h2>
                <span className="task-count">{overdueTasks.length}</span>
              </div>
              <div className="column-content">
                {overdueTasks.map(task => (
                  <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Column - Show Only If Tasks Exist (Lower Priority) */}
          {upcomingTasks.length > 0 && (
            <div className="task-column upcoming-column">
              <div className="column-header">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> Upcoming</h2>
                <span className="task-count">{upcomingTasks.length}</span>
              </div>
              <div className="column-content">
                {upcomingTasks.map(task => (
                  <TaskCard key={task._id || task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          )}
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

        {/* Completed Tasks Section */}
        {showCompleted && completedTasksList.length > 0 && (
          <div className="completed-section" style={{ marginTop: '30px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '15px'
            }}>
              <h2 style={{ margin: 0 }}>✅ Completed Tasks</h2>
              <span style={{ 
                background: '#dcfce7', 
                color: '#166534', 
                padding: '4px 10px', 
                borderRadius: '12px', 
                fontSize: '13px',
                fontWeight: 600 
              }}>
                {completedTasksList.length}
              </span>
            </div>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '12px' 
            }}>
              {completedTasksList.map(task => (
                <div key={task._id || task.id} style={{ opacity: 0.7 }}>
                  <TaskCard task={task} onEdit={handleEdit} onDelete={handleDelete} />
                </div>
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

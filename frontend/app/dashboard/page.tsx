'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard, Plus, Search, Sun, Moon, LogOut,
  AlertTriangle, CalendarDays, CalendarClock, Inbox,
  ChevronDown, ChevronRight, CheckCircle2, Circle, Edit3, Trash2,
  Zap, Clock, Tag, BarChart2, StickyNote, Timer, Bell,
  Sparkles, TrendingUp, Flame, Settings
} from 'lucide-react';

import { useTheme } from '@/contexts/ThemeContext';
import LoadingScreen from '@/components/LoadingScreen';
import CreateTaskModal from '@/components/CreateTaskModal';
import QuickNotes from '@/components/QuickNotes';
import PomodoroTimer from '@/components/PomodoroTimer';
import Analytics from '@/components/Analytics';
import ProfileModal from '@/components/ProfileModal';
import { initializeNotificationEngine, sendLocalNotification } from '@/utils/notifications';
import MobileWorkspaceModal from '@/components/MobileWorkspaceModal';

// ─── Types ──────────────────────────────────────────
type Task = {
  _id?: string; id?: string;
  title: string; description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'progress' | 'done';
  dueDate?: string;
  category?: string;
  tags?: string[];
};

type PanelTab = 'timer' | 'notes' | 'stats';
type ViewFilter = 'today' | 'upcoming' | 'all';

// ─── Constants ──────────────────────────────────────
const QUOTES = [
  'The secret of getting ahead is getting started.',
  'Small steps every day lead to big results.',
  'Focus on progress, not perfection.',
  "Done is better than perfect.",
  'You don\'t have to be great to start, but you have to start to be great.',
  'Productivity is never an accident.',
  'Your future self will thank you for what you do today.',
];

const PRIORITY_RANK: Record<string, number> = { high: 1, medium: 2, low: 3 };

const DEMO_TASKS: Task[] = [
  { _id: 'd1', title: 'Review Q3 budget report', description: 'Check the finance team\'s quarterly analysis and approve', priority: 'high', status: 'progress', category: 'work', dueDate: new Date().toISOString() },
  { _id: 'd2', title: 'Team standup call', description: '30-min daily sync with engineering', priority: 'medium', status: 'todo', category: 'work', dueDate: new Date().toISOString() },
  { _id: 'd3', title: 'Grocery shopping', description: 'Weekly groceries — oats, eggs, vegetables, milk', priority: 'low', status: 'todo', category: 'personal', dueDate: new Date().toISOString() },
  { _id: 'd4', title: 'Fix login page bug', description: 'Users report redirect not working after email OTP', priority: 'high', status: 'todo', category: 'work', dueDate: (() => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString(); })() },
  { _id: 'd5', title: 'Morning run', description: '5km jog around the park', priority: 'medium', status: 'done', category: 'health', dueDate: new Date().toISOString() },
  { _id: 'd6', title: 'Read "Atomic Habits" ch 5', priority: 'low', status: 'todo', category: 'learning', dueDate: (() => { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString(); })() },
];

// ─── Helper ──────────────────────────────────────────
function getTaskId(t: Task) { return t._id || t.id || ''; }

function relDate(isoStr: string) {
  const d = new Date(isoStr); d.setHours(0,0,0,0);
  const today = new Date(); today.setHours(0,0,0,0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  if (diff < -1) return `${Math.abs(diff)}d overdue`;
  if (diff < 7) return `In ${diff} days`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isToday(iso: string) {
  const d = new Date(iso); d.setHours(0,0,0,0);
  const t = new Date(); t.setHours(0,0,0,0);
  return d.getTime() === t.getTime();
}
function isTomorrow(iso: string) {
  const d = new Date(iso); d.setHours(0,0,0,0);
  const t = new Date(); t.setDate(t.getDate()+1); t.setHours(0,0,0,0);
  return d.getTime() === t.getTime();
}
function isPast(iso: string) {
  const d = new Date(iso); d.setHours(0,0,0,0);
  const t = new Date(); t.setHours(0,0,0,0);
  return d < t;
}

function sortTasks(list: Task[]) {
  return [...list].sort((a,b) => {
    const pa = PRIORITY_RANK[a.priority] ?? 2;
    const pb = PRIORITY_RANK[b.priority] ?? 2;
    if (pa !== pb) return pa - pb;
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return 0;
  });
}

// ─── TaskRow component ───────────────────────────────
function TaskRow({ task, onEdit, onDelete, onToggleDone, idx }: {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  idx: number;
}) {
  const id = getTaskId(task);
  const done = task.status === 'done';
  const dateLabel = task.dueDate ? relDate(task.dueDate) : null;
  const isOvd = task.dueDate && isPast(task.dueDate) && !done && !isToday(task.dueDate);

  return (
    <div
      className={`task-row p-${task.priority}${done ? ' done' : ''}`}
      style={{ animationDelay: `${idx * 0.04}s` }}
    >
      <button
        className={`task-check-btn${done ? ' checked' : ''}`}
        onClick={() => onToggleDone(id)}
        aria-label={done ? 'Mark incomplete' : 'Mark complete'}
      >
        {done && (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5l2.5 2.5L9 2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      <div className="task-row-body">
        <span className="task-row-title">{task.title}</span>
        {task.description && (
          <span className="task-row-desc">{task.description}</span>
        )}
        {(task.category || (task.tags && task.tags.length > 0)) && (
          <div className="task-row-tags">
            {task.category && (
              <span className={`task-tag ${task.category}`}>
                <Tag size={9} /> {task.category}
              </span>
            )}
            {task.tags?.slice(0, 2).map(t => (
              <span key={t} className="task-tag">{t}</span>
            ))}
          </div>
        )}
      </div>

      <div className="task-row-meta">
        <span className={`mini-pri ${task.priority}`}>{task.priority}</span>
        {dateLabel && (
          <span className={`task-date-badge${isOvd ? ' overdue' : isToday(task.dueDate!) ? ' today' : ''}`}>
            <CalendarDays size={10} /> {dateLabel}
          </span>
        )}
      </div>

      <div className="task-row-actions">
        <button className="task-action-btn edit" onClick={() => onEdit(task)} aria-label="Edit task">
          <Edit3 size={13} />
        </button>
        <button className="task-action-btn del" onClick={() => onDelete(id)} aria-label="Delete task">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

// ─── TaskGroup component ─────────────────────────────
function TaskGroup({ label, dotCls, tasks, onEdit, onDelete, onToggleDone, defaultOpen = true }: {
  label: string; dotCls: string;
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
  onToggleDone: (id: string) => void;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  if (tasks.length === 0) return null;
  const done = tasks.filter(t => t.status === 'done').length;
  const pct = tasks.length > 0 ? (done / tasks.length) * 100 : 0;

  return (
    <div className="task-group">
      <div className="group-header" onClick={() => setOpen(o => !o)}>
        <div className={`group-dot ${dotCls}`} />
        <span className="group-title">{label}</span>
        <span className="group-count">{tasks.length}</span>
        {tasks.length > 0 && (
          <div className="group-prog-track">
            <div className="group-prog-fill" style={{ width: `${pct}%` }} />
          </div>
        )}
        <ChevronDown
          size={14}
          className={`group-chevron${open ? ' open' : ''}`}
          style={{ marginLeft: 'auto' }}
        />
      </div>
      {open && (
        <div className="group-tasks">
          {tasks.map((t, i) => (
            <TaskRow key={getTaskId(t)} task={t} onEdit={onEdit} onDelete={onDelete} onToggleDone={onToggleDone} idx={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────
export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted]   = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName]   = useState('');
  const [tasks, setTasks]       = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [panelTab, setPanelTab]  = useState<PanelTab>('timer');
  const [viewFilter, setViewFilter] = useState<ViewFilter>('today');
  const [search, setSearch]     = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileWorkspace, setShowMobileWorkspace] = useState(false);
  const [mobileWorkspaceTab, setMobileWorkspaceTab] = useState<'timer' | 'notes' | 'stats'>('timer');
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  const [streak] = useState(3); // demo streak
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const e = localStorage.getItem('userEmail');
    const n = localStorage.getItem('userName');
    if (e) {
      setUserEmail(e);
      if (n) setUserName(n);
    } else {
      window.location.href = '/';
      return;
    }
    fetchTasks();
    initializeNotificationEngine();
  }, []);

  // Global keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); searchRef.current?.focus(); }
      if (e.key === 'n' && !e.metaKey && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const fetchTasks = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      const res = await fetch(`http://localhost:5000/tasks?userEmail=${encodeURIComponent(email || '')}`);
      if (res.ok) { setTasks(await res.json()); return; }
    } catch {}
    setTasks(DEMO_TASKS);
  };

  const handleTaskCreated = () => fetchTasks();

  const handleEdit = (task: Task) => { setEditingTask(task); setShowModal(true); };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try { await fetch(`http://localhost:5000/tasks/${id}`, { method: 'DELETE' }); } catch {}
    fetchTasks();
  };

  const handleToggleDone = async (id: string) => {
    const task = tasks.find(t => getTaskId(t) === id);
    if (!task) return;
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    try {
      await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, status: newStatus }),
      });
    } catch {}
    setTasks(prev => prev.map(t => getTaskId(t) === id ? { ...t, status: newStatus } : t));
  };

  const handleModalClose = () => { setShowModal(false); setEditingTask(null); };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  if (!mounted) return null;

  // ─── Task categorization ───────────────────────────
  const filtered = search.trim()
    ? tasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.category?.toLowerCase().includes(search.toLowerCase())
      )
    : tasks;

  const now  = new Date(); now.setHours(0,0,0,0);
  const tom  = new Date(now); tom.setDate(now.getDate()+1);
  const dat  = new Date(now); dat.setDate(now.getDate()+2);

  const todayTasks    = sortTasks(filtered.filter(t => t.dueDate && isToday(t.dueDate)));
  const tomorrowTasks = sortTasks(filtered.filter(t => t.dueDate && isTomorrow(t.dueDate) && t.status !== 'done'));
  const overdueTasks  = sortTasks(filtered.filter(t => t.dueDate && isPast(t.dueDate) && !isToday(t.dueDate) && t.status !== 'done'));
  const upcomingTasks = sortTasks(filtered.filter(t => {
    if (!t.dueDate) return false;
    const d = new Date(t.dueDate); d.setHours(0,0,0,0);
    return d >= dat && t.status !== 'done';
  }));
  const noDueTasks = sortTasks(filtered.filter(t => !t.dueDate && t.status !== 'done'));

  // stats for hero
  const totalT = tasks.length;
  const doneT  = tasks.filter(t => t.status === 'done').length;
  const activeT = tasks.filter(t => t.status !== 'done').length;
  const todayAll = tasks.filter(t => t.dueDate && isToday(t.dueDate));
  const todayDone = todayAll.filter(t => t.status === 'done').length;
  const todayPct  = todayAll.length > 0 ? todayDone / todayAll.length : 0;
  const ringOffset = 196 * (1 - todayPct);

  // Visible task groups based on view filter
  const showAll = viewFilter === 'all';
  const showUpcoming = viewFilter === 'upcoming' || showAll;

  const PANEL_TABS: { id: PanelTab; label: string; Icon: any }[] = [
    { id: 'timer', label: 'Timer',    Icon: Timer },
    { id: 'notes', label: 'Notes',    Icon: StickyNote },
    { id: 'stats', label: 'Insights', Icon: BarChart2 },
  ];

  return (
    <>
      {!appReady && <LoadingScreen onComplete={() => setAppReady(true)} />}

      <div className="app-shell" style={{ opacity: appReady ? 1 : 0, transition: 'opacity 0.3s ease' }}>

        {/* ─── Header ─────────────────────────────── */}
        <header className="app-header">
          {/* Brand */}
          <div className="header-brand">
            <div className="header-brand-icon" style={{ overflow: 'hidden', padding: 0 }}>
              <img src="/icon-192.png" alt="TaskPilot Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <span className="header-brand-name">TaskPilot</span>
          </div>

          <div className="header-divider" />

          {/* Nav */}
          <nav className="header-nav">
            {[
              { id: 'today' as ViewFilter,    label: 'Today',    Icon: LayoutDashboard },
              { id: 'upcoming' as ViewFilter, label: 'Upcoming', Icon: CalendarClock },
              { id: 'all' as ViewFilter,      label: 'All Tasks', Icon: CheckCircle2 },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                className={`header-nav-btn${viewFilter === id ? ' active' : ''}`}
                onClick={() => setViewFilter(id)}
              >
                <Icon size={14} /> {label}
              </button>
            ))}
          </nav>

          <div className="header-spacer" />

          {/* Search */}
          <div className="header-search">
            <Search size={14} className="header-search-icon" />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search tasks…  ⌘K"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="header-actions">
            <button className="header-icon-btn" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <button
              id="add-task-btn"
              className="btn-new-task"
              onClick={() => setShowModal(true)}
            >
              <Plus size={15} /> New Task
            </button>

            {/* Avatar + dropdown */}
            <div className="user-dropdown">
              <div
                className="header-avatar"
                onClick={() => setShowUserMenu(v => !v)}
                title={userEmail}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              {showUserMenu && (
                <div className="user-menu" onMouseLeave={() => setShowUserMenu(false)}>
                  <div style={{ padding: '8px 12px 10px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>{userName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-3)' }}>{userEmail}</div>
                  </div>
                  <button className="user-menu-item" onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}>
                    <Settings size={14} /> Profile & Settings
                  </button>
                  {/* Mobile Utility Hub items */}
                  <button className="user-menu-item mobile-only-item" onClick={() => { setShowUserMenu(false); setMobileWorkspaceTab('timer'); setShowMobileWorkspace(true); }}>
                    <Timer size={14} /> Focus Timer
                  </button>
                  <button className="user-menu-item mobile-only-item" onClick={() => { setShowUserMenu(false); setMobileWorkspaceTab('notes'); setShowMobileWorkspace(true); }}>
                    <StickyNote size={14} /> Quick Notes
                  </button>
                  <button className="user-menu-item mobile-only-item" onClick={() => { setShowUserMenu(false); setMobileWorkspaceTab('stats'); setShowMobileWorkspace(true); }}>
                    <BarChart2 size={14} /> Productivity Analytics
                  </button>
                  <button className="user-menu-item desktop-only-item" onClick={() => { setShowUserMenu(false); setPanelTab('stats'); }}>
                    <BarChart2 size={14} /> Analytics
                  </button>
                  <button className="user-menu-item desktop-only-item" onClick={() => { setShowUserMenu(false); setPanelTab('notes'); }}>
                    <StickyNote size={14} /> Quick Notes
                  </button>
                  <div className="user-menu-divider" />
                  <button
                    className="user-menu-item danger"
                    onClick={() => { localStorage.removeItem('userEmail'); window.location.href = '/'; }}
                  >
                    <LogOut size={14} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── App Body ────────────────────────────── */}
        <div className="app-body">

          {/* ─── Main ──────────────────────────────── */}
          <main className="app-main">

            {/* Hero */}
            <div className="hero">
              <div>
                <div className="hero-greeting">
                  {getGreeting()}, {userName}
                </div>
                <div className="hero-date">
                  <CalendarDays size={12} /> {formattedDate}
                </div>
                <div className="hero-quote">"{quote}"</div>
                {streak > 0 && (
                  <div style={{ marginTop: '12px' }}>
                    <span className="streak-badge">
                      <Flame size={12} /> {streak} day streak
                    </span>
                  </div>
                )}
              </div>

              <div className="hero-right">
                {/* Progress ring */}
                <div className="hero-ring-wrap">
                  <svg className="hero-ring-svg" width="76" height="76" viewBox="0 0 76 76">
                    <circle className="hero-ring-track" cx="38" cy="38" r="31" />
                    <circle
                      className="hero-ring-fill animated"
                      cx="38" cy="38" r="31"
                      style={{ '--offset': `${ringOffset}` } as any}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className="hero-ring-text">
                    <div className="hero-ring-pct">{Math.round(todayPct * 100)}%</div>
                    <div className="hero-ring-sub">today</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="hero-stats">
                  <div className="hero-stat-row">
                    <span className="hero-stat-val">{totalT}</span>
                    <span>total tasks</span>
                  </div>
                  <div className="hero-stat-row">
                    <span className="hero-stat-val" style={{ color: 'var(--green)' }}>{doneT}</span>
                    <span>completed</span>
                  </div>
                  <div className="hero-stat-row">
                    <span className="hero-stat-val" style={{ color: overdueTasks.length > 0 ? 'var(--red)' : 'var(--text)' }}>{overdueTasks.length}</span>
                    <span>overdue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter bar */}
            <div className="task-filter-bar">
              {[
                { id: 'today' as ViewFilter,    label: 'Today',    count: todayTasks.length },
                { id: 'upcoming' as ViewFilter, label: 'Upcoming', count: tomorrowTasks.length + upcomingTasks.length },
                { id: 'all' as ViewFilter,      label: 'All',      count: tasks.length },
              ].map(f => (
                <button
                  key={f.id}
                  className={`filter-tab${viewFilter === f.id ? ' active' : ''}`}
                  onClick={() => setViewFilter(f.id)}
                >
                  {f.label}
                  {f.count > 0 && <span className="count">{f.count}</span>}
                </button>
              ))}

              {overdueTasks.length > 0 && (
                <button
                  className={`filter-tab${viewFilter === 'all' ? ' active' : ''}`}
                  style={{ color: 'var(--red)', borderColor: 'var(--red-border)', background: 'var(--red-bg)' }}
                  onClick={() => setViewFilter('all')}
                >
                  <AlertTriangle size={11} /> {overdueTasks.length} Overdue
                </button>
              )}

              <div className="filter-spacer" />

              {search && (
                <div style={{ fontSize: '12px', color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Search size={11} /> {filtered.length} result{filtered.length !== 1 ? 's' : ''}
                  <button
                    style={{ padding: '3px 8px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border)', background: 'transparent', fontSize: '11px', color: 'var(--text-3)', cursor: 'pointer' }}
                    onClick={() => setSearch('')}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Task Groups */}
            <div className="task-groups">
              {/* Overdue — always show if any */}
              {overdueTasks.length > 0 && (viewFilter === 'all' || viewFilter === 'today') && (
                <TaskGroup
                  label="Overdue"
                  dotCls="overdue"
                  tasks={overdueTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDone={handleToggleDone}
                  defaultOpen
                />
              )}

              {/* Today */}
              {(viewFilter === 'today' || viewFilter === 'all') && (
                <TaskGroup
                  label="Today"
                  dotCls="today"
                  tasks={todayTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDone={handleToggleDone}
                  defaultOpen
                />
              )}

              {/* Tomorrow */}
              {(viewFilter === 'upcoming' || viewFilter === 'all') && (
                <TaskGroup
                  label="Tomorrow"
                  dotCls="tomorrow"
                  tasks={tomorrowTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDone={handleToggleDone}
                  defaultOpen={viewFilter === 'upcoming'}
                />
              )}

              {/* Upcoming */}
              {(viewFilter === 'upcoming' || viewFilter === 'all') && (
                <TaskGroup
                  label="Upcoming"
                  dotCls="upcoming"
                  tasks={upcomingTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDone={handleToggleDone}
                  defaultOpen={viewFilter === 'upcoming'}
                />
              )}

              {/* No due date */}
              {viewFilter === 'all' && noDueTasks.length > 0 && (
                <TaskGroup
                  label="Someday"
                  dotCls="nodate"
                  tasks={noDueTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleDone={handleToggleDone}
                  defaultOpen={false}
                />
              )}

              {/* Empty state */}
              {filtered.length === 0 && (
                <div className="empty-group">
                  <div style={{ fontWeight: 600, color: 'var(--text-2)', fontSize: '15px' }}>
                    {search ? `No tasks matching "${search}"` : 'Nothing here yet'}
                  </div>
                  <div style={{ maxWidth: '220px' }}>
                    {search ? 'Try different keywords' : 'Press N or click + New Task to add your first task'}
                  </div>
                </div>
              )}
            </div>

          </main>

          {/* ─── Right Panel ─────────────────────── */}
          <aside className="app-panel">
            <div className="panel-tabs">
              {PANEL_TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`panel-tab${panelTab === id ? ' active' : ''}`}
                  onClick={() => setPanelTab(id)}
                >
                  <Icon size={13} /> {label}
                </button>
              ))}
            </div>

            <div className="panel-content">
              {panelTab === 'timer' && <PomodoroTimer />}
              {panelTab === 'notes' && <QuickNotes />}
              {panelTab === 'stats' && <Analytics tasks={tasks} />}
            </div>
          </aside>

        </div>
      </div>

      {/* Modal */}
      <CreateTaskModal
        isOpen={showModal}
        onClose={handleModalClose}
        onTaskCreated={handleTaskCreated}
        editingTask={editingTask}
      />

      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userEmail={userEmail}
        currentName={userName}
        onProfileUpdated={(newName) => setUserName(newName)}
      />

      <MobileWorkspaceModal
        isOpen={showMobileWorkspace}
        onClose={() => setShowMobileWorkspace(false)}
        tasks={tasks}
        defaultTab={mobileWorkspaceTab}
      />
    </>
  );
}

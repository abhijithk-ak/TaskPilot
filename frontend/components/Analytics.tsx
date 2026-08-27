'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, CheckCircle2, Flame, BarChart2 } from 'lucide-react';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DEFAULT_HABITS = [
  { id: 'hydrate',  label: 'Drink 8 glasses of water', streak: 3 },
  { id: 'workout',  label: '30 min workout',            streak: 1 },
  { id: 'read',     label: 'Read for 20 minutes',       streak: 5 },
  { id: 'journal',  label: 'Write in journal',          streak: 0 },
];

export default function Analytics({ tasks }: { tasks: any[] }) {
  const [weekData, setWeekData] = useState<number[]>(Array(7).fill(0));
  const [habits, setHabits] = useState(DEFAULT_HABITS.map(h => ({ ...h, done: false })));

  useEffect(() => {
    // Generate week data from tasks
    const now = new Date();
    const data = Array(7).fill(0);
    tasks.forEach(t => {
      if (t.status === 'done' && t.updatedAt) {
        const d = new Date(t.updatedAt);
        const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
        if (diff >= 0 && diff < 7) data[6 - diff]++;
      }
    });
    // Add some demo data if no real data
    if (data.every(v => v === 0)) {
      data[0] = 2; data[1] = 4; data[2] = 1; data[3] = 5; data[4] = 3; data[5] = 6; data[6] = tasks.filter(t => t.status === 'done').length;
    }
    setWeekData(data);

    // Load habit state from localStorage
    try {
      const saved = localStorage.getItem('tp-habits-today');
      const today = new Date().toDateString();
      if (saved) {
        const { date, state } = JSON.parse(saved);
        if (date === today) {
          setHabits(prev => prev.map(h => ({ ...h, done: state[h.id] ?? false })));
        }
      }
    } catch {}
  }, [tasks]);

  const toggleHabit = (id: string) => {
    const updated = habits.map(h => h.id === id ? { ...h, done: !h.done } : h);
    setHabits(updated);
    const state: Record<string, boolean> = {};
    updated.forEach(h => { state[h.id] = h.done; });
    localStorage.setItem('tp-habits-today', JSON.stringify({ date: new Date().toDateString(), state }));
  };

  const maxVal = Math.max(...weekData, 1);
  const totalDone = tasks.filter(t => t.status === 'done').length;
  const totalActive = tasks.filter(t => t.status !== 'done').length;
  const habitsToday = habits.filter(h => h.done).length;

  const todayIdx = new Date().getDay();
  const weekLabels = Array.from({ length: 7 }, (_, i) => DAYS[(todayIdx - 6 + i + 7) % 7]);

  return (
    <div className="analytics-wrap">
      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Done</span>
            <CheckCircle2 size={14} className="stat-card-icon" style={{ color: 'var(--green)' }} />
          </div>
          <div className="stat-big" style={{ color: 'var(--green)' }}>{totalDone}</div>
          <div className="stat-sub">tasks completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-title">Active</span>
            <TrendingUp size={14} className="stat-card-icon" style={{ color: 'var(--primary)' }} />
          </div>
          <div className="stat-big">{totalActive}</div>
          <div className="stat-sub">in progress</div>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">This Week</span>
          <BarChart2 size={14} className="stat-card-icon" />
        </div>
        <div className="week-bars">
          {weekData.map((val, i) => {
            const heightPct = (val / maxVal) * 100;
            return (
              <div key={i} className="week-bar-wrap">
                <div className="week-bar" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div
                    className="week-bar-fill"
                    style={{
                      height: `${heightPct}%`,
                      background: i === 6 ? 'var(--primary)' : 'var(--primary-light)',
                      position: 'static',
                      borderRadius: '3px 3px 0 0',
                      minHeight: val > 0 ? '3px' : '0',
                      transition: 'height 0.8s var(--ease)'
                    }}
                  />
                </div>
                <span className="week-bar-label">{weekLabels[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Habits */}
      <div className="stat-card">
        <div className="stat-card-header">
          <span className="stat-card-title">Daily Habits</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--amber-text)', fontWeight: 600 }}>
            <Flame size={13} style={{ color: 'var(--amber)' }} />
            {habitsToday}/{habits.length} today
          </div>
        </div>
        <div className="habits-list">
          {habits.map(h => (
            <div key={h.id} className="habit-row">
              <button
                className={`habit-check${h.done ? ' done' : ''}`}
                onClick={() => toggleHabit(h.id)}
                aria-label={h.done ? 'Mark incomplete' : 'Mark complete'}
              >
                {h.done && (
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2.5 2.5L8 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
              <span className={`habit-label${h.done ? ' done' : ''}`}>{h.label}</span>
              {h.streak > 0 && (
                <span className="habit-streak">{h.streak + (h.done ? 1 : 0)}d streak</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain, Timer } from 'lucide-react';

const MODES = [
  { id: 'work',       label: 'Focus',      minutes: 25, color: 'var(--primary)' },
  { id: 'short',      label: 'Short Break', minutes: 5,  color: 'var(--green)' },
  { id: 'long',       label: 'Long Break',  minutes: 15, color: 'var(--cyan)' },
];
const SESSIONS_BEFORE_LONG = 4;
const CIRCUMFERENCE = 440; // 2 * π * 70

export default function PomodoroTimer() {
  const [modeIdx, setModeIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(MODES[0].minutes * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [totalFocusSec, setTotalFocusSec] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const focusRef = useRef(0);

  const mode = MODES[modeIdx];
  const total = mode.minutes * 60;
  const progress = (timeLeft / total);
  const dashOffset = CIRCUMFERENCE * progress;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  const formatFocus = (s: number) => {
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m`;
    return `${Math.floor(m/60)}h ${m%60}m`;
  };

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
  }, []);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        // Session complete
        if (modeIdx === 0) {
          const newSessions = sessions + 1;
          setSessions(newSessions);
          setTotalFocusSec(t => t + focusRef.current);
          focusRef.current = 0;
          // Auto-switch to break
          const nextMode = newSessions % SESSIONS_BEFORE_LONG === 0 ? 2 : 1;
          setModeIdx(nextMode);
          setTimeLeft(MODES[nextMode].minutes * 60);
        } else {
          // Break done → back to work
          setModeIdx(0);
          setTimeLeft(MODES[0].minutes * 60);
        }
        setRunning(false);
        // Try browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('TaskPilot Timer', {
            body: modeIdx === 0 ? 'Focus session complete! Take a break.' : 'Break over. Back to work!',
          });
        }
        return 0;
      }
      if (modeIdx === 0) focusRef.current += 1;
      return prev - 1;
    });
  }, [modeIdx, sessions]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      stop();
    }
    return stop;
  }, [running, tick, stop]);

  const handleModeChange = (idx: number) => {
    setModeIdx(idx);
    setTimeLeft(MODES[idx].minutes * 60);
    setRunning(false);
    focusRef.current = 0;
  };

  const handleReset = () => {
    setRunning(false);
    setTimeLeft(mode.minutes * 60);
    focusRef.current = 0;
  };

  const requestNotifPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="timer-wrap">
      {/* Mode tabs */}
      <div className="timer-mode-tabs">
        {MODES.map((m, i) => (
          <button
            key={m.id}
            className={`timer-mode-btn${modeIdx === i ? ' active' : ''}`}
            onClick={() => handleModeChange(i)}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Ring */}
      <div className="timer-ring-wrap">
        <svg className="timer-ring-svg" width="160" height="160" viewBox="0 0 160 160">
          <circle className="timer-ring-track" cx="80" cy="80" r="70" />
          <circle
            className={`timer-ring-prog${modeIdx !== 0 ? ' break' : ''}`}
            cx="80" cy="80" r="70"
            strokeDashoffset={dashOffset}
            style={{ stroke: mode.color }}
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">{formatTime(timeLeft)}</div>
          <div className="timer-mode-label">{mode.label}</div>
        </div>
      </div>

      {/* Controls */}
      <div className="timer-controls">
        <button className="timer-ctrl-btn" onClick={handleReset} title="Reset">
          <RotateCcw size={15} />
        </button>
        <button
          className={`timer-ctrl-btn primary${running ? ' running' : ''}`}
          onClick={() => { setRunning(r => !r); requestNotifPermission(); }}
          title={running ? 'Pause' : 'Start'}
        >
          {running ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button className="timer-ctrl-btn" onClick={() => handleModeChange(modeIdx === 0 ? 1 : 0)} title="Skip">
          <Coffee size={15} />
        </button>
      </div>

      {/* Session dots */}
      <div>
        <div className="timer-sessions" style={{ justifyContent: 'center' }}>
          {Array.from({ length: SESSIONS_BEFORE_LONG }).map((_, i) => (
            <div key={i} className={`timer-session-dot${i < (sessions % SESSIONS_BEFORE_LONG) ? ' done' : ''}`} />
          ))}
        </div>
        <div className="timer-today-stat" style={{ marginTop: '10px' }}>
          <Brain size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
          <strong>{sessions}</strong> sessions · <strong>{formatFocus(totalFocusSec + focusRef.current)}</strong> focused today
        </div>
      </div>
    </div>
  );
}

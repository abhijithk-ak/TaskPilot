'use client';
import { useState } from 'react';
import { X, StickyNote, Timer, BarChart2 } from 'lucide-react';
import PomodoroTimer from '@/components/PomodoroTimer';
import QuickNotes from '@/components/QuickNotes';
import Analytics from '@/components/Analytics';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  tasks: any[];
  defaultTab?: 'timer' | 'notes' | 'stats';
};

export default function MobileWorkspaceModal({ isOpen, onClose, tasks, defaultTab = 'timer' }: Props) {
  const [tab, setTab] = useState<'timer' | 'notes' | 'stats'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: '460px', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div className="modal-top" style={{ padding: '16px 20px 10px', flexShrink: 0 }}>
          <div className="modal-heading">Productivity Hub</div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="panel-tabs" style={{ background: 'var(--surface-2)', padding: '0 8px', flexShrink: 0 }}>
          {[
            { id: 'timer', label: 'Timer', Icon: Timer },
            { id: 'notes', label: 'Notes', Icon: StickyNote },
            { id: 'stats', label: 'Insights', Icon: BarChart2 },
          ].map(t => (
            <button
              key={t.id}
              className={`panel-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id as any)}
            >
              <t.Icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Inner Panel */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {tab === 'timer' && <PomodoroTimer />}
          {tab === 'notes' && <QuickNotes />}
          {tab === 'stats' && <Analytics tasks={tasks} />}
        </div>
      </div>
    </div>
  );
}

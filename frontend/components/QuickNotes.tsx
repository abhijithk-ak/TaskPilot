'use client';
import { useState, useEffect, useRef } from 'react';
import { StickyNote, Plus, Trash2, Pin } from 'lucide-react';

type Note = {
  id: string;
  content: string;
  color: string;
  createdAt: number;
};

const COLORS = [
  { id: 'default', bg: '#F0F0F8', label: 'Default' },
  { id: 'yellow',  bg: '#FFE066', label: 'Yellow' },
  { id: 'pink',    bg: '#FFB3D9', label: 'Pink' },
  { id: 'green',   bg: '#A8F0C6', label: 'Green' },
  { id: 'blue',    bg: '#93C5FD', label: 'Blue' },
  { id: 'purple',  bg: '#C4B5FD', label: 'Purple' },
];

function fmtDate(ts: number) {
  const d = new Date(ts);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function QuickNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('tp-notes');
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  const save = (updated: Note[]) => {
    setNotes(updated);
    localStorage.setItem('tp-notes', JSON.stringify(updated));
  };

  const addNote = () => {
    const n: Note = { id: Date.now().toString(), content: '', color: 'default', createdAt: Date.now() };
    const updated = [n, ...notes];
    save(updated);
    setEditingId(n.id);
  };

  const updateContent = (id: string, content: string) => {
    save(notes.map(n => n.id === id ? { ...n, content } : n));
  };

  const updateColor = (id: string, color: string) => {
    save(notes.map(n => n.id === id ? { ...n, color } : n));
  };

  const deleteNote = (id: string) => {
    save(notes.filter(n => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const nonEmpty = notes.filter(n => n.content.trim() || editingId === n.id);

  return (
    <div>
      <div className="notes-header">
        <span className="notes-title">
          <StickyNote size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
          Quick Notes
        </span>
        <button className="notes-add-btn" onClick={addNote}>
          <Plus size={12} /> New Note
        </button>
      </div>

      {nonEmpty.length === 0 ? (
        <div className="note-empty">
          <div style={{ fontWeight: 600, color: 'var(--text-2)', marginBottom: '4px' }}>No notes yet</div>
          <div>Click "New Note" to capture a thought</div>
        </div>
      ) : (
        <div className="notes-grid">
          {nonEmpty.map((note, i) => (
            <div
              key={note.id}
              className={`note-card note-color-${note.color}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <button className="note-del" onClick={() => deleteNote(note.id)}>
                <Trash2 size={11} />
              </button>
              <textarea
                className="note-textarea"
                value={note.content}
                placeholder="Write something…"
                onChange={e => updateContent(note.id, e.target.value)}
                onFocus={() => setEditingId(note.id)}
                rows={3}
              />
              <div className="note-footer">
                <span className="note-date">{fmtDate(note.createdAt)}</span>
                <div className="note-colors">
                  {COLORS.map(c => (
                    <div
                      key={c.id}
                      className={`note-color-pick${note.color === c.id ? ' sel' : ''}`}
                      style={{ background: c.bg }}
                      title={c.label}
                      onClick={() => updateColor(note.id, c.id)}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

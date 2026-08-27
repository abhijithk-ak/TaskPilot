'use client';
import { useState, useEffect } from 'react';
import { Brain, X, PenLine, Sparkles, Tag, Calendar } from 'lucide-react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  editingTask?: any;
};

async function saveTask(method: 'POST' | 'PUT', url: string, body: any) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Failed');
  return res.json();
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated, editingTask }: Props) {
  const [title, setTitle]           = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority]     = useState('medium');
  const [status, setStatus]         = useState('todo');
  const [dueDate, setDueDate]       = useState('');
  const [category, setCategory]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [aiResult, setAiResult]     = useState<any>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingTask) {
      setTitle(editingTask.title || '');
      setDescription(editingTask.description || '');
      setPriority(editingTask.priority || 'medium');
      setStatus(editingTask.status || 'todo');
      setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : '');
      setCategory(editingTask.category || '');
    } else {
      setTitle(''); setDescription(''); setPriority('medium');
      setStatus('todo'); setDueDate(''); setCategory('');
    }
    setAiResult(null);
  }, [isOpen, editingTask]);

  if (!isOpen) return null;

  const handleAI = async () => {
    if (!description.trim()) { alert('Enter a description for AI to analyze.'); return; }
    setClassifying(true); setAiResult(null);
    try {
      const res = await fetch('http://localhost:5000/tasks/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      if (!res.ok) throw new Error();
      const d = await res.json();
      setPriority(d.priority || 'medium');
      setStatus(d.status || 'todo');
      if (d.category) setCategory(d.category);
      setAiResult(d);
    } catch {
      setAiResult({ error: true, reason: 'AI service unavailable. Fill fields manually.' });
    } finally { setClassifying(false); }
  };

  const handleSubmit = async () => {
    if (!title.trim()) { alert('Task title is required.'); return; }
    if (!dueDate)      { alert('Please set a due date.'); return; }
    setLoading(true);
    try {
      const body = { title: title.trim(), description: description.trim(), priority, status, dueDate, category: category || undefined };
      const userEmail = localStorage.getItem('userEmail');
      const saved = editingTask
        ? await saveTask('PUT', `http://localhost:5000/tasks/${editingTask._id}`, body)
        : await saveTask('POST', 'http://localhost:5000/tasks', { ...body, userEmail });
      onTaskCreated(saved);
      onClose();
    } catch (e: any) { alert(e.message || 'Error saving task.'); }
    finally { setLoading(false); }
  };

  const confCls = aiResult?.confidence >= 0.7 ? 'high' : aiResult?.confidence >= 0.5 ? 'medium' : 'low';

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-top">
          <div className="modal-heading">
            <div className="modal-heading-icon">
              {editingTask ? <PenLine size={18} /> : <PenLine size={18} />}
            </div>
            {editingTask ? 'Edit Task' : 'New Task'}
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="modal-body">
          {/* Title */}
          <div className="field">
            <label className="field-label" htmlFor="t-title">Title</label>
            <input
              id="t-title" className="field-input"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="field">
            <label className="field-label" htmlFor="t-desc">Description</label>
            <textarea
              id="t-desc" className="field-textarea"
              placeholder="Describe the task — AI will analyze this to suggest priority, category, and status…"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          {/* AI Button */}
          <button className="ai-btn" onClick={handleAI} disabled={classifying || !description.trim()}>
            {classifying ? <><div className="spinner" />Analyzing with AI…</> : <><Brain size={15} />Auto-Categorize with AI</>}
          </button>

          {/* AI Result */}
          {aiResult && !aiResult.error && (
            <div className="ai-result">
              <div className="ai-result-header">
                <div className="ai-label"><Sparkles size={11} /> AI Classification</div>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {aiResult.ai_powered
                    ? <span className="ai-source-badge"><Brain size={9} /> AI</span>
                    : <span className="ai-source-badge fallback">Keyword</span>}
                  <span className={`confidence-pill ${confCls}`}>{Math.round((aiResult.confidence||0)*100)}%</span>
                </div>
              </div>
              <div className="ai-chips">
                <span className={`mini-pri ${aiResult.priority}`}>{aiResult.priority}</span>
                <span className={`status-pill ${aiResult.status}`}>{aiResult.status === 'todo' ? 'To Do' : aiResult.status === 'progress' ? 'In Progress' : 'Done'}</span>
                {aiResult.category && <span className={`task-tag ${aiResult.category}`}><Tag size={9} /> {aiResult.category}</span>}
                {aiResult.tags?.slice(0,2).map((t: string) => <span key={t} className="task-tag">{t}</span>)}
              </div>
              {aiResult.reason && <div className="ai-reason">AI: {aiResult.reason}</div>}
            </div>
          )}
          {aiResult?.error && (
            <div style={{ background: 'var(--red-bg)', border: '1px solid var(--red-border)', borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: '12px', color: 'var(--red-text)' }}>
              Error: {aiResult.reason}
            </div>
          )}

          {/* Priority + Status */}
          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="t-pri">Priority</label>
              <select id="t-pri" className="field-select" value={priority} onChange={e => setPriority(e.target.value)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="t-status">Status</label>
              <select id="t-status" className="field-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="todo">To Do</option>
                <option value="progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Category + Due Date */}
          <div className="field-row">
            <div className="field">
              <label className="field-label" htmlFor="t-cat">Category</label>
              <select id="t-cat" className="field-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">None</option>
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="health">Health</option>
                <option value="learning">Learning</option>
                <option value="finance">Finance</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label" htmlFor="t-due"><Calendar size={10} style={{display:'inline',marginRight:'3px'}} />Due Date</label>
              <input id="t-due" type="date" className="field-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
            <button id="save-task-btn" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
              {loading ? <><div className="spinner" />{editingTask ? 'Saving…' : 'Creating…'}</> : editingTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

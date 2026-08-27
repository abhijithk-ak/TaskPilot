'use client';

import { Edit3, Trash2, Clock, Zap, CheckCircle2, CalendarDays, Tag } from 'lucide-react';

type Task = {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'progress' | 'done';
  dueDate?: string;
  category?: string;
  tags?: string[];
};

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
};

const StatusConfig = {
  todo:     { label: 'To Do',       Icon: Clock,         cls: 'todo' },
  progress: { label: 'In Progress', Icon: Zap,           cls: 'progress' },
  done:     { label: 'Done',        Icon: CheckCircle2,  cls: 'done' },
};

const PriorityConfig = {
  high:   { label: 'High',   cls: 'high' },
  medium: { label: 'Medium', cls: 'medium' },
  low:    { label: 'Low',    cls: 'low' },
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const taskId = task._id || task.id;
  const status = StatusConfig[task.status] ?? StatusConfig.todo;
  const priority = PriorityConfig[task.priority] ?? PriorityConfig.medium;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`task-card priority-${task.priority} ${task.status === 'done' ? 'done' : ''}`}>
      {/* Header row */}
      <div className="task-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`status-badge ${status.cls}`}>
          <status.Icon size={9} strokeWidth={2.5} />
          {status.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      {/* Category & Tags */}
      {(task.category || (task.tags && task.tags.length > 0)) && (
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
          {task.category && (
            <span className="category-badge">
              <Tag size={9} />
              {task.category}
            </span>
          )}
          {task.tags?.slice(0, 2).map(tag => (
            <span key={tag} style={{
              fontSize: '10px',
              fontWeight: 600,
              padding: '2px 6px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--bg-elevated)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border)',
            }}>{tag}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="task-footer">
        <div className="task-meta">
          <span className={`priority-pill ${priority.cls}`}>
            {priority.label}
          </span>
          {task.dueDate && (
            <span className="due-date">
              <CalendarDays size={10} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        <div className="task-actions">
          {onEdit && (
            <div className="tooltip-wrap">
              <button
                onClick={() => onEdit(task)}
                className="btn btn-ghost btn-icon"
                aria-label="Edit task"
              >
                <Edit3 size={13} />
              </button>
              <div className="tooltip">Edit</div>
            </div>
          )}
          {onDelete && taskId && (
            <div className="tooltip-wrap">
              <button
                onClick={() => onDelete(taskId)}
                className="btn btn-danger-ghost btn-icon"
                aria-label="Delete task"
              >
                <Trash2 size={13} />
              </button>
              <div className="tooltip">Delete</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

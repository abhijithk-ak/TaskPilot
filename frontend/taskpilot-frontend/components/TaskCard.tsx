import { Edit3, Trash2 } from 'lucide-react';

type Task = {
  id?: string;
  _id?: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "progress" | "done";
  dueDate?: string;
};

type TaskCardProps = {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
};

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const taskId = task._id || task.id;

  return (
    <div className={`task-card priority-${task.priority} ${task.status === 'done' ? 'done' : ''}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px', gap: '8px' }}>
        <h4 className="task-title">
          {task.title}
        </h4>
        <span className={`status-badge ${task.status}`}>
          {task.status === 'todo' ? 'TODO' : task.status === 'progress' ? 'IN PROGRESS' : 'DONE'}
        </span>
      </div>

      {task.description && (
        <p className="task-desc">
          {task.description}
        </p>
      )}

      <div className="task-footer">
        <div className="task-meta">
          {task.dueDate && (
            <span className="due-date">
              Due: {new Date(task.dueDate).toDateString()}
            </span>
          )}
        </div>

        <div className="task-actions">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="btn edit"
            >
              <Edit3 size={14} /> Edit
            </button>
          )}
          {onDelete && taskId && (
            <button
              onClick={() => onDelete(taskId)}
              className="btn delete"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

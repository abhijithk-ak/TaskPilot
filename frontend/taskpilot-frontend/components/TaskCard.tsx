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
    <div className={`task-card priority-${task.priority}`}>
      <h4>{task.title}</h4>

      {task.description && (
        <p className="task-desc">{task.description}</p>
      )}

      <div className="task-meta">
        <span className={`badge status-${task.status}`}>
          {task.status.toUpperCase()}
        </span>

        <span className="due-date">
          {task.dueDate ? `Due: ${new Date(task.dueDate).toDateString()}` : 'No due date'}
        </span>
      </div>

      <div className="task-actions" style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
        {onEdit && (
          <button
            onClick={() => onEdit(task)}
            className="btn-edit"
            style={{ 
              padding: '4px 10px', 
              fontSize: '12px', 
              background: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Edit
          </button>
        )}
        {onDelete && taskId && (
          <button
            onClick={() => onDelete(taskId)}
            className="btn-delete"
            style={{ 
              padding: '4px 10px', 
              fontSize: '12px', 
              background: '#e74c3c', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

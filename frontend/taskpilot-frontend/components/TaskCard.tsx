type Task = {
  id: string;
  title: string;
  description?: string;
  priority: "high" | "medium" | "low";
  status: "todo" | "progress" | "done";
  dueDate: string;
};

export default function TaskCard({ task }: { task: Task }) {
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
          Due: {new Date(task.dueDate).toDateString()}
        </span>
      </div>
    </div>
  );
}

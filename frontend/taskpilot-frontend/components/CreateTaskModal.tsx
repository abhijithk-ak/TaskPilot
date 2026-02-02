import { useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
};

export default function CreateTaskModal({ isOpen, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title.trim()) return alert("Title is required");

    onCreate({
      id: Date.now().toString(),
      title,
      description,
      priority,
      status,
      dueDate,
    });

    onClose();
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("todo");
    setDueDate("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create Task</h3>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="row">
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="actions">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit}>
            Save Task
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  editingTask?: any;
};

async function createTask(task: any) {
  const userEmail = localStorage.getItem("userEmail");
  const res = await fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ ...task, userEmail })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || "Failed to create task");
  }

  return res.json();
}

async function updateTask(id: string, task: any) {
  const res = await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(task)
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorData.error || "Failed to update task");
  }

  return res.json();
}

export default function CreateTaskModal({ isOpen, onClose, onTaskCreated, editingTask }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isClassifying, setIsClassifying] = useState(false);
  const [aiConfidence, setAiConfidence] = useState<number | null>(null);
  const [aiReason, setAiReason] = useState<string>("");

  // Reset form to pristine state when modal opens or editingTask changes
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        // Editing existing task - pre-fill but clear AI state
        setTitle(editingTask.title || "");
        setDescription(editingTask.description || "");
        setPriority(editingTask.priority || "medium");
        setStatus(editingTask.status || "todo");
        setDueDate(editingTask.dueDate ? editingTask.dueDate.split('T')[0] : "");
        setAiConfidence(null);
        setAiReason("");
      } else {
        // Creating new task - completely fresh state
        setTitle("");
        setDescription("");
        setPriority("medium");
        setStatus("todo");
        setDueDate("");
        setAiConfidence(null);
        setAiReason("");
      }
    }
  }, [isOpen, editingTask]);

  if (!isOpen) return null;

  const handleAutoCategorize = async () => {
    if (!description.trim()) {
      alert("Please enter a description first");
      return;
    }

    setIsClassifying(true);
    setAiConfidence(null);
    setAiReason("");
    
    try {
      const res = await fetch("http://localhost:5000/tasks/classify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ description })
      });

      if (!res.ok) {
        throw new Error("Failed to classify task");
      }

      const data = await res.json();
      
      // Auto-fill priority and status from AI
      setPriority(data.priority || "medium");
      setStatus(data.status || "todo");
      
      // Store AI confidence and reason
      setAiConfidence(data.confidence || 0);
      setAiReason(data.reason || "AI classification completed");
    } catch (err: any) {
      alert("AI classification failed. Make sure AI service is running.");
      console.error("Classification error:", err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) return alert("Title is required");
    if (!dueDate) return alert("Due date is required");

    setLoading(true);
    try {
      const taskData = {
        title,
        description,
        priority,
        status,
        dueDate
      };

      let savedTask;
      if (editingTask) {
        savedTask = await updateTask(editingTask._id, taskData);
      } else {
        savedTask = await createTask(taskData);
      }

      onTaskCreated(savedTask);
      
      // Reset form to pristine state
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("todo");
      setDueDate("");
      setAiConfidence(null);
      setAiReason("");
      onClose();
    } catch (err: any) {
      const errorMsg = err.message || 'Error saving task. Make sure backend is running.';
      alert(errorMsg);
      console.error('Create/Update task error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingTask ? 'Edit Task' : 'Create Task'}</h3>

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

        <button 
          type="button"
          className="btn secondary" 
          onClick={handleAutoCategorize}
          disabled={isClassifying || !description.trim()}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          {isClassifying ? "🤖 Analyzing..." : "🤖 Auto-Categorize"}
        </button>

        {aiConfidence !== null && aiReason && (
          <div style={{
            background: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '6px',
            padding: '10px 12px',
            marginBottom: '12px',
            fontSize: '13px'
          }}>
            <div style={{ 
              fontWeight: '600', 
              color: '#0369a1', 
              marginBottom: '4px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span>🤖 Auto-categorized • </span>
              <span className={
                aiConfidence >= 0.7 ? 'confidence-high' :
                aiConfidence >= 0.5 ? 'confidence-medium' :
                'confidence-low'
              }>
                {Math.round(aiConfidence * 100)}% confident
              </span>
              <div className="tooltip-container">
                <span className="tooltip-icon">i</span>
                <div className="tooltip-content" style={{ 
                  whiteSpace: 'normal', 
                  width: '220px',
                  textAlign: 'left',
                  lineHeight: '1.4'
                }}>
                  <div style={{ fontWeight: '600', marginBottom: '6px' }}>Confidence is based on:</div>
                  <div>• Keyword match strength</div>
                  <div>• Number of signals detected</div>
                  <div>• Task description clarity</div>
                </div>
              </div>
            </div>
            <div style={{ color: '#0c4a6e', fontSize: '12px' }}>
              {aiReason}
            </div>
          </div>
        )}

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
          <button className="btn secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="btn primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : editingTask ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}

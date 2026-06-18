import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const CATS = ["DSA", "Aptitude", "Reasoning", "English", "Maths", "Project", "Other"];
const CAT_COLORS = {
  DSA: { bg: "rgba(59,130,246,0.15)", color: "#60a5fa" },
  Aptitude: { bg: "rgba(16,185,129,0.15)", color: "#34d399" },
  Reasoning: { bg: "rgba(239,68,68,0.15)", color: "#f87171" },
  English: { bg: "rgba(168,85,247,0.15)", color: "#c084fc" },
  Maths: { bg: "rgba(245,158,11,0.15)", color: "#fbbf24" },
  Project: { bg: "rgba(99,102,241,0.15)", color: "#818cf8" },
  Other: { bg: "rgba(148,163,184,0.15)", color: "#94a3b8" },
};

export default function GeneralTracker() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [category, setCategory] = useState("DSA");
  const [deadline, setDeadline] = useState("");
  const [filter, setFilter] = useState("All");
  const docRef = doc(db, "general_tasks", user.uid);

  useEffect(() => {
    getDoc(docRef).then(snap => {
      if (snap.exists()) setTasks(snap.data().tasks || []);
    });
  }, []);

  const save = async (updated) => {
    setTasks(updated);
    await setDoc(docRef, { tasks: updated });
  };

  const addTask = () => {
    if (!taskName.trim()) return;
    const newTask = { id: Date.now(), name: taskName, category, deadline, done: false };
    save([newTask, ...tasks]);
    setTaskName("");
    setDeadline("");
    toast.success("Task added!");
  };

  const toggleTask = (id) => save(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const deleteTask = (id) => { save(tasks.filter(t => t.id !== id)); toast.success("Task removed"); };

  const cats = ["All", ...CATS];
  const filtered = filter === "All" ? tasks : tasks.filter(t => t.category === filter);
  const doneCount = tasks.filter(t => t.done).length;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>📚 General Study Tracker</h1>
          <p>{doneCount}/{tasks.length} tasks completed</p>
        </div>

        {/* Add task */}
        <div className="add-task-form">
          <input
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
            placeholder="Add a task..."
            onKeyDown={e => e.key === "Enter" && addTask()}
            style={{ minWidth: 220 }}
          />
          <select value={category} onChange={e => setCategory(e.target.value)}>
            {CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <input
            type="date"
            value={deadline}
            onChange={e => setDeadline(e.target.value)}
            style={{ maxWidth: 160 }}
          />
          <button className="btn-add" onClick={addTask}>+ Add</button>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          {cats.map(c => (
            <button key={c} className={`day-btn ${filter === c ? "active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
          ))}
        </div>

        {/* Tasks */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", color: "var(--text2)", padding: "60px 0", fontSize: 15 }}>
            No tasks yet. Add one above 👆
          </div>
        ) : (
          <div className="tasks-list">
            {filtered.map(task => {
              const col = CAT_COLORS[task.category] || CAT_COLORS.Other;
              return (
                <div key={task.id} className={`task-item ${task.done ? "done-task" : ""}`}>
                  <button
                    className={`check-btn ${task.done ? "checked" : ""}`}
                    onClick={() => toggleTask(task.id)}
                    style={{ flexShrink: 0 }}
                  >
                    {task.done ? "✓" : ""}
                  </button>
                  <span className="task-name">{task.name}</span>
                  <span className="task-category" style={{ background: col.bg, color: col.color }}>{task.category}</span>
                  {task.deadline && (
                    <span className="task-date">{new Date(task.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  )}
                  <button className="btn-delete" onClick={() => deleteTask(task.id)}>✕</button>
                </div>
              );
            })}
          </div>
        )}

        {tasks.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${Math.round((doneCount / tasks.length) * 100)}%` }} />
            </div>
            <div className="progress-text" style={{ marginTop: 8 }}>
              {Math.round((doneCount / tasks.length) * 100)}% complete
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

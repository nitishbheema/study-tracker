import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";

export default function Dashboard() {
  const { user } = useAuth();
  const name = user?.displayName?.split(" ")[0] || "there";

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>{greeting}, {name} 👋</h1>
          <p>What are you working on today?</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">STREAK</div>
            <div className="stat-value" style={{ color: "#f59e0b" }}>0 🔥</div>
            <div className="stat-sub">days in a row</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TCS PROGRESS</div>
            <div className="stat-value" style={{ color: "#6366f1" }}>Day 1</div>
            <div className="stat-sub">of 30 days</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">TASKS TODAY</div>
            <div className="stat-value" style={{ color: "#10b981" }}>0/14</div>
            <div className="stat-sub">completed</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">OVERALL</div>
            <div className="stat-value" style={{ color: "#a855f7" }}>0%</div>
            <div className="stat-sub">plan completed</div>
          </div>
        </div>

        <div className="cards-grid">
          <Link to="/tcs" className="feature-card">
            <div className="card-icon" style={{ background: "rgba(99,102,241,0.15)" }}>🎯</div>
            <h3>TCS Prep Tracker</h3>
            <p>30-day structured plan with daily time slots, DSA + Aptitude + Reasoning topics, and per-slot progress tracking.</p>
            <span className="badge" style={{ background: "rgba(99,102,241,0.15)", color: "#818cf8" }}>30 Days</span>
          </Link>

          <Link to="/general" className="feature-card">
            <div className="card-icon" style={{ background: "rgba(16,185,129,0.15)" }}>📚</div>
            <h3>General Study Tracker</h3>
            <p>Add any task, assign a category and deadline, mark them off as you go. Works for any subject or goal.</p>
            <span className="badge" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>Custom</span>
          </Link>

          <Link to="/excel-planner" className="feature-card">
            <div className="card-icon" style={{ background: "rgba(245,158,11,0.15)" }}>📊</div>
            <h3>Excel Plan Generator</h3>
            <p>Upload your Excel timetable and the system reads it, generates a clean study plan and tracks your progress.</p>
            <span className="badge" style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}>Upload</span>
          </Link>
        </div>

        <div style={{
          marginTop: 28,
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 14,
          padding: "16px 20px"
        }}>
          <div style={{ fontWeight: 600, marginBottom: 6 }}>🚨 Non-Negotiables</div>
          <div style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.8 }}>
            ❌ No portfolio changes &nbsp;·&nbsp; ❌ No new projects &nbsp;·&nbsp; ❌ No random frameworks &nbsp;·&nbsp; ❌ No "I'll start tomorrow"<br />
            ✅ TCS &nbsp;·&nbsp; ✅ Aptitude &nbsp;·&nbsp; ✅ Coding &nbsp;·&nbsp; ✅ Mock Tests
          </div>
        </div>
      </main>
    </div>
  );
}

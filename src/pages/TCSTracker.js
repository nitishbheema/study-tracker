import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

const SCHEDULE = [
  { time: "2:00 PM – 3:00 PM",   task: "Lunch + Rest",            type: "break" },
  { time: "3:00 PM – 4:00 PM",   task: "DSA Problem 1",            type: "dsa" },
  { time: "4:00 PM – 5:00 PM",   task: "DSA Problem 2 & 3",        type: "dsa" },
  { time: "5:00 PM – 5:30 PM",   task: "Snack Break",              type: "break" },
  { time: "5:30 PM – 6:30 PM",   task: "Aptitude Topic Study",     type: "apt" },
  { time: "6:30 PM – 7:30 PM",   task: "Aptitude Questions (30+)", type: "apt" },
  { time: "7:30 PM – 8:30 PM",   task: "Dinner",                   type: "break" },
  { time: "8:30 PM – 9:30 PM",   task: "Reasoning Topic",          type: "reason" },
  { time: "9:30 PM – 10:00 PM",  task: "Reasoning Questions",      type: "reason" },
  { time: "10:00 PM – 10:30 PM", task: "Break",                    type: "break" },
  { time: "10:30 PM – 11:30 PM", task: "TCS Practice Set",         type: "tcs" },
  { time: "11:30 PM – 12:30 AM", task: "Verbal English",           type: "eng" },
  { time: "12:30 AM – 1:00 AM",  task: "Formula Revision",         type: "apt" },
  { time: "1:00 AM – 2:00 AM",   task: "Free Time / Sleep Prep",  type: "break" },
];

const DAY_TOPICS = [
  { days: [1,2,3,4],          apt: "Percentages, Ratio & Proportion", dsa: "Arrays" },
  { days: [5,6,7,8],          apt: "Profit & Loss, Averages",         dsa: "Strings" },
  { days: [9,10,11,12],       apt: "Time & Work, Pipes & Cisterns",   dsa: "Searching" },
  { days: [13,14,15,16],      apt: "Time Speed Distance",             dsa: "Sorting" },
  { days: [17,18,19,20],      apt: "SI & CI",                         dsa: "HashMap" },
  { days: [21,22,23,24],      apt: "Probability",                     dsa: "Stack & Queue" },
  { days: [25,26,27],         apt: "Permutation & Combination",       dsa: "Mixed Coding" },
  { days: [28,29,30],         apt: "Full Mock Tests",                 dsa: "Revision Only" },
];

function getTopics(day) {
  for (const g of DAY_TOPICS) {
    if (g.days.includes(day)) return { apt: g.apt, dsa: g.dsa };
  }
  return { apt: "", dsa: "" };
}

const TYPE_LABELS = { dsa: "DSA", apt: "Aptitude", reason: "Reasoning", eng: "English", tcs: "TCS", break: "Break" };

export default function TCSTracker() {
  const { user } = useAuth();
  const [activeDay, setActiveDay] = useState(1);
  const [progress, setProgress] = useState({});
  const [saving, setSaving] = useState(false);

  const docRef = doc(db, "tcs_progress", user.uid);

  useEffect(() => {
    getDoc(docRef).then(snap => {
      if (snap.exists()) setProgress(snap.data());
    });
  }, []);

  const toggle = async (day, idx) => {
    const key = `d${day}_${idx}`;
    const updated = { ...progress, [key]: !progress[key] };
    setProgress(updated);
    setSaving(true);
    await setDoc(docRef, updated);
    setSaving(false);
    if (!progress[key]) toast.success("Task done! 🔥");
  };

  const dayDone = (day) => {
    const slots = SCHEDULE.filter(s => s.type !== "break");
    return slots.filter((_, i) => {
      const realIdx = SCHEDULE.indexOf(slots[i]);
      return progress[`d${day}_${realIdx}`];
    }).length;
  };

  const totalSlots = SCHEDULE.filter(s => s.type !== "break").length;
  const currentDayDone = SCHEDULE.reduce((acc, _, i) => acc + (progress[`d${activeDay}_${i}`] ? 1 : 0), 0);
  const pct = Math.round((currentDayDone / SCHEDULE.length) * 100);

  const topics = getTopics(activeDay);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>🎯 TCS Prep Tracker</h1>
          <p>30-day structured schedule — mark each slot as you complete it</p>
        </div>

        {/* Day selector */}
        <div className="day-selector">
          {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
            const done = dayDone(day);
            const cls = day === activeDay ? "active" : done >= totalSlots ? "completed" : "";
            return (
              <button key={day} className={`day-btn ${cls}`} onClick={() => setActiveDay(day)}>
                Day {day}
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="day-progress">
          <h3>Day {activeDay} Progress &nbsp;·&nbsp; {topics.apt} &nbsp;|&nbsp; DSA: {topics.dsa}</h3>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-text">{currentDayDone}/{SCHEDULE.length} slots done ({pct}%) {saving && "· saving..."}</div>
        </div>

        {/* Schedule table */}
        <div className="schedule-table">
          <div className="schedule-header">
            <span>Time</span>
            <span>Task</span>
            <span>Done</span>
            <span>Category</span>
          </div>
          {SCHEDULE.map((slot, idx) => {
            const key = `d${activeDay}_${idx}`;
            const done = !!progress[key];
            return (
              <div key={idx} className={`schedule-row ${slot.type === "break" ? "break-row" : ""} ${done ? "done" : ""}`}>
                <div className="time-cell">{slot.time}</div>
                <div className={`task-cell ${slot.type === "break" ? "break-t" : slot.type}`}>
                  {slot.task}
                </div>
                <button
                  className={`check-btn ${done ? "checked" : ""}`}
                  onClick={() => toggle(activeDay, idx)}
                >
                  {done ? "✓" : ""}
                </button>
                <span className="topic-pill">{TYPE_LABELS[slot.type]}</span>
              </div>
            );
          })}
        </div>

        {/* Daily targets reminder */}
        <div style={{ background: "var(--bg2)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px" }}>
          <div style={{ fontWeight: 600, marginBottom: 10, fontSize: 14 }}>📊 Daily Targets</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {["3 DSA Problems", "30 Aptitude Qs", "20 Reasoning Qs", "15 English Qs", "15 min Formula Rev"].map(t => (
              <span key={t} style={{
                fontSize: 12, padding: "4px 12px", borderRadius: 20,
                background: "rgba(16,185,129,0.1)", color: "#34d399", fontWeight: 600
              }}>✅ {t}</span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

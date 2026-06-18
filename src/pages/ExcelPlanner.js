import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import Sidebar from "../components/Sidebar";
import toast from "react-hot-toast";

export default function ExcelPlanner() {
  const [plan, setPlan] = useState(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    setLoading(true);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const raw = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (raw.length === 0) { toast.error("Sheet is empty!"); setLoading(false); return; }

        // Detect columns flexibly
        const keys = Object.keys(raw[0]);
        const timeKey   = keys.find(k => /time/i.test(k)) || keys[0];
        const taskKey   = keys.find(k => /task|subject|topic|activity/i.test(k)) || keys[1];
        const statusKey = keys.find(k => /status|done|complete/i.test(k)) || keys[2];
        const notesKey  = keys.find(k => /note|remark/i.test(k));

        const rows = raw.map((r, i) => ({
          id: i,
          time: String(r[timeKey] || ""),
          task: String(r[taskKey] || ""),
          status: String(r[statusKey] || ""),
          notes: notesKey ? String(r[notesKey] || "") : "",
          done: false,
        })).filter(r => r.task);

        setPlan({ rows, source: file.name, total: rows.length, columns: { timeKey, taskKey } });
        toast.success(`Loaded ${rows.length} tasks from ${file.name} 🎉`);
      } catch (err) {
        toast.error("Could not read file. Make sure it's a valid .xlsx or .csv");
      }
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleFile = (e) => processFile(e.target.files[0]);
  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const toggleRow = (id) => {
    setPlan(p => ({ ...p, rows: p.rows.map(r => r.id === id ? { ...r, done: !r.done } : r) }));
  };

  const doneCount = plan?.rows.filter(r => r.done).length || 0;
  const pct = plan ? Math.round((doneCount / plan.total) * 100) : 0;

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>📊 Excel Plan Generator</h1>
          <p>Upload your timetable Excel — system reads it and lets you track progress</p>
        </div>

        {!plan && (
          <div
            className={`upload-zone ${dragging ? "dragging" : ""}`}
            onClick={() => inputRef.current.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3>{loading ? "Reading file..." : "Drop your Excel file here"}</h3>
            <p style={{ marginTop: 8 }}>or click to browse &nbsp;·&nbsp; Supports .xlsx, .xls, .csv</p>
            <p style={{ marginTop: 12, fontSize: 12, color: "var(--text2)" }}>
              Your file should have columns like: Time, Task, Status
            </p>
            <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: "none" }} onChange={handleFile} />
          </div>
        )}

        {plan && (
          <>
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 20, flexWrap: "wrap" }}>
              <button
                onClick={() => { setPlan(null); setFileName(""); }}
                style={{ padding: "8px 16px", background: "var(--bg3)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text2)", cursor: "pointer", fontFamily: "Space Grotesk", fontSize: 13 }}
              >
                ← Upload new file
              </button>
              <span style={{ fontSize: 13, color: "var(--text2)" }}>📄 {fileName}</span>
              <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                {doneCount}/{plan.total} done ({pct}%)
              </span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
              </div>
            </div>

            <div className="plan-output">
              <div className="plan-header">
                <h3>Your Study Plan</h3>
                <p>Click the checkbox to mark tasks as done</p>
              </div>
              <table className="plan-table">
                <thead>
                  <tr>
                    <th style={{ width: 40 }}></th>
                    <th>Time / Slot</th>
                    <th>Task</th>
                    {plan.rows.some(r => r.notes) && <th>Notes</th>}
                  </tr>
                </thead>
                <tbody>
                  {plan.rows.map(row => (
                    <tr key={row.id} style={{ opacity: row.done ? 0.5 : 1 }}>
                      <td>
                        <button
                          className={`check-btn ${row.done ? "checked" : ""}`}
                          onClick={() => toggleRow(row.id)}
                        >
                          {row.done ? "✓" : ""}
                        </button>
                      </td>
                      <td style={{ fontFamily: "JetBrains Mono", fontSize: 12, color: "var(--text2)" }}>{row.time}</td>
                      <td style={{ fontWeight: 500, textDecoration: row.done ? "line-through" : "none" }}>{row.task}</td>
                      {plan.rows.some(r => r.notes) && <td style={{ fontSize: 13, color: "var(--text2)" }}>{row.notes}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

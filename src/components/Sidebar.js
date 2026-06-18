import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const nav = [
  { to: "/dashboard", icon: "🏠", label: "Dashboard" },
  { to: "/tcs", icon: "🎯", label: "TCS Tracker" },
  { to: "/general", icon: "📚", label: "General Tracker" },
  { to: "/excel-planner", icon: "📊", label: "Excel Planner" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out!");
    navigate("/login");
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || "U";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>StudyTrack 🎯</h2>
        <p>Prep Command Center</p>
      </div>
      <nav className="sidebar-nav">
        {nav.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <span>{icon}</span> {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-user">
        <div className="user-info">
          <div className="user-avatar">{initials}</div>
          <div>
            <div className="user-name">{user?.displayName || "User"}</div>
            <div className="user-email">{user?.email}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>Sign out</button>
      </div>
    </aside>
  );
}

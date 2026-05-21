import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Home,
  BarChart3,
  FileText,
  Users,
  User,
  Shield,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="rounded-xl bg-blue-600 p-2">
            <Shield className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="font-bold text-slate-900">
              Barangay Bantay
            </h1>

            <p className="text-xs text-slate-500">
              Incident Reporting System
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-4">

          <Link
            to="/"
            className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-slate-100"
          >
            <Home size={18} />
            Home
          </Link>

          {isAuthenticated && (
            <>
              <Link
                to="/dashboard"
                className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                <BarChart3 size={18} />
                Dashboard
              </Link>

              <Link
                to="/my-reports"
                className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                <FileText size={18} />
                Reports
              </Link>

              {isAdmin() && (
                <>
                  <Link
                    to="/analytics"
                    className="rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    Analytics
                  </Link>

                  <Link
                    to="/users"
                    className="flex items-center gap-1 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Users size={18} />
                    Users
                  </Link>
                </>
              )}

              {/* Notification Bell */}
              <Link
                to="/notifications"
                className="relative rounded-lg p-2 hover:bg-slate-100"
              >
                <Bell className="h-5 w-5" />

                {/* Notification Bell */}
                <Link
                  to="/notifications"
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-slate-100 transition"
                >
                  <Bell className="h-6 w-6 text-slate-700" />

                  {/* Only show badge if notifications exist */}
                  {0 > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                      0
                    </span>
                  )}
                </Link>
              </Link>

              {/* Profile */}
              <Link
                to="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-slate-100"
              >
                <User size={18} />
                {user?.name}
              </Link>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          )}

          {!isAuthenticated && (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 hover:bg-slate-100"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  Menu,
  X,
  Home,
  FileText,
  BarChart3,
  Users,
  LogOut,
  Bell,
  User,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
    setMobileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = isAuthenticated
    ? isAdmin()
      ? [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/reports', label: 'Reports', icon: FileText },
          { path: '/analytics', label: 'Analytics', icon: BarChart3 },
          { path: '/users', label: 'Users', icon: Users },
        ]
      : [
          { path: '/dashboard', label: 'Dashboard', icon: Home },
          { path: '/report', label: 'Report Incident', icon: AlertTriangle },
          { path: '/my-reports', label: 'My Reports', icon: FileText },
        ]
    : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 shadow-md shadow-blue-200">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-bold tracking-tight text-slate-900">
                Barangay<span className="text-blue-600">Bantay</span>
              </span>
              <p className="-mt-0.5 text-[10px] font-medium leading-tight text-slate-500">
                Incident Reporting System
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700">
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1.5 top-1.5 flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
                  </span>
                </button>

                {/* Profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-xs font-bold text-white">
                      {user?.name.charAt(0)}
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="text-sm font-medium text-slate-900">{user?.name.split(' ')[0]}</p>
                      <p className="text-[10px] capitalize text-slate-500">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {profileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                      <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                        <div className="border-b border-slate-100 px-4 py-3">
                          <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
                          <p className="text-xs text-slate-500">{user?.email}</p>
                        </div>
                        <div className="py-1">
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          >
                            <User className="h-4 w-4 text-slate-400" />
                            Profile
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700"
                >
                  Report Incident
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="space-y-1 px-4 py-3">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

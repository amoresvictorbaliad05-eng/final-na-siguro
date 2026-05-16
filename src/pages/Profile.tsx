import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  CheckCircle2,
  FileText,
  Clock,
} from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { reports } = useReports();

  if (!user) return null;

  const userReports = reports.filter(r => r.reporterId === user.id);
  const stats = {
    total: userReports.length,
    pending: userReports.filter(r => r.status === 'pending').length,
    approved: userReports.filter(r => r.status === 'approved').length,
    resolved: userReports.filter(r => r.status === 'resolved').length,
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end gap-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-blue-500 to-indigo-600 text-3xl font-bold text-white shadow-lg">
                {user.name.charAt(0)}
              </div>
              <div className="mb-1">
                <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.role === 'superadmin'
                    ? 'bg-purple-100 text-purple-700'
                    : user.role === 'admin'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {user.role === 'superadmin' ? 'Super Admin' : user.role === 'admin' ? 'Admin' : 'Citizen'}
                </span>
              </div>
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium text-slate-900">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium text-slate-900">{user.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Address</p>
                    <p className="text-sm font-medium text-slate-900">{user.address}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Member Since</p>
                    <p className="text-sm font-medium text-slate-900">
                      {new Date(user.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Verification Status</p>
                    <p className={`flex items-center gap-1 text-sm font-medium ${user.isVerified ? 'text-green-600' : 'text-amber-600'}`}>
                      {user.isVerified ? (
                        <><CheckCircle2 className="h-4 w-4" /> Verified Account</>
                      ) : (
                        <>Pending Verification</>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">User ID</p>
                    <p className="font-mono text-sm text-slate-900">{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <FileText className="mx-auto h-6 w-6 text-blue-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</p>
            <p className="text-xs text-slate-500">Total Reports</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Clock className="mx-auto h-6 w-6 text-amber-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.pending}</p>
            <p className="text-xs text-slate-500">Pending</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <CheckCircle2 className="mx-auto h-6 w-6 text-green-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.approved}</p>
            <p className="text-xs text-slate-500">Approved</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
            <Shield className="mx-auto h-6 w-6 text-emerald-500" />
            <p className="mt-2 text-2xl font-bold text-slate-900">{stats.resolved}</p>
            <p className="text-xs text-slate-500">Resolved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

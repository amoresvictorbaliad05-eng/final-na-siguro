import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import StatsCard from '../components/StatsCard';
import ReportCard from '../components/ReportCard';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  ChevronRight,
  Users,
} from 'lucide-react';

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const { reports, activityLogs, updateReportStatus, getReportsByUser } = useReports();

  const displayReports = isAdmin() ? reports : getReportsByUser(user?.id || '');

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      total: displayReports.length,
      pending: displayReports.filter(r => r.status === 'pending').length,
      approved: displayReports.filter(r => r.status === 'approved').length,
      rejected: displayReports.filter(r => r.status === 'rejected').length,
      resolved: displayReports.filter(r => r.status === 'resolved').length,
      underReview: displayReports.filter(r => r.status === 'under_review').length,
      today: displayReports.filter(r => new Date(r.createdAt) >= today).length,
      thisWeek: displayReports.filter(r => new Date(r.createdAt) >= weekAgo).length,
    };
  }, [displayReports]);

  const recentReports = displayReports.slice(0, 5);
  const pendingReports = displayReports.filter(r => r.status === 'pending').slice(0, 3);

  const handleApprove = (id: string) => {
    updateReportStatus(id, 'approved', 'Verified by responding officer.', user?.id);
  };

  const handleReject = (id: string) => {
    updateReportStatus(id, 'rejected', 'Insufficient evidence provided.', user?.id);
  };

  const greetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">
            {greetingTime()}, {user?.name.split(' ')[0]}!
          </h1>
          <p className="mt-1 text-slate-500">
            {isAdmin()
              ? "Here's an overview of all incident reports in the barangay."
              : 'Track your submitted incident reports and their status.'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Reports"
            value={stats.total}
            icon={FileText}
            color="blue"
            change={`${stats.thisWeek} this week`}
            changeType="neutral"
          />
          <StatsCard
            title="Pending Review"
            value={stats.pending}
            icon={Clock}
            color="amber"
            subtitle="Awaiting action"
          />
          <StatsCard
            title="Approved"
            value={stats.approved}
            icon={CheckCircle2}
            color="green"
            change={`${stats.resolved} resolved`}
            changeType="up"
          />
          <StatsCard
            title={isAdmin() ? 'Total Users' : 'Rejected'}
            value={isAdmin() ? stats.total : stats.rejected}
            icon={isAdmin() ? Users : XCircle}
            color={isAdmin() ? 'purple' : 'red'}
            subtitle={isAdmin() ? 'Active reporters' : undefined}
          />
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Pending Reports (Admin) */}
            {isAdmin() && pendingReports.length > 0 && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    <h2 className="text-lg font-semibold text-amber-900">
                      Reports Requiring Action ({stats.pending})
                    </h2>
                  </div>
                  <Link
                    to="/reports"
                    className="flex items-center gap-1 text-sm font-medium text-amber-700 hover:text-amber-900"
                  >
                    View all
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="space-y-3">
                  {pendingReports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      showActions
                      onApprove={handleApprove}
                      onReject={handleReject}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Reports */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">Recent Reports</h2>
                <Link
                  to={isAdmin() ? '/reports' : '/my-reports'}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentReports.length > 0 ? (
                  recentReports.map(report => (
                    <ReportCard key={report.id} report={report} />
                  ))
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center">
                    <FileText className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-3 text-sm text-slate-500">No reports yet</p>
                    {!isAdmin() && (
                      <Link
                        to="/report"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                      >
                        <AlertTriangle className="h-4 w-4" />
                        Report an Incident
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                {!isAdmin() && (
                  <Link
                    to="/report"
                    className="flex w-full items-center gap-3 rounded-xl bg-blue-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Report New Incident
                  </Link>
                )}
                {isAdmin() && (
                  <>
                    <Link
                      to="/reports?status=pending"
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Clock className="h-5 w-5 text-amber-500" />
                      Review Pending ({stats.pending})
                    </Link>
                    <Link
                      to="/analytics"
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      View Analytics
                    </Link>
                    <Link
                      to="/users"
                      className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      <Users className="h-5 w-5 text-green-500" />
                      Manage Users
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <div className="space-y-4">
                {activityLogs.slice(0, 6).map(log => {
                  const actionColors: Record<string, string> = {
                    report_submitted: 'bg-blue-500',
                    report_approved: 'bg-green-500',
                    report_rejected: 'bg-red-500',
                    report_resolved: 'bg-emerald-500',
                    login: 'bg-slate-400',
                    report_reviewing: 'bg-amber-500',
                  };

                  return (
                    <div key={log.id} className="flex items-start gap-3">
                      <div className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${actionColors[log.action] || 'bg-slate-400'}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-slate-700">
                          <span className="font-medium">{log.userName}</span>{' '}
                          {log.details}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-400">
                          {new Date(log.timestamp).toLocaleString('en-PH', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status distribution mini chart */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Status Overview</h3>
              <div className="mt-4 space-y-3">
                {[
                  { label: 'Pending', value: stats.pending, color: 'bg-amber-500', total: stats.total },
                  { label: 'Under Review', value: stats.underReview, color: 'bg-blue-500', total: stats.total },
                  { label: 'Approved', value: stats.approved, color: 'bg-green-500', total: stats.total },
                  { label: 'Rejected', value: stats.rejected, color: 'bg-red-500', total: stats.total },
                  { label: 'Resolved', value: stats.resolved, color: 'bg-emerald-500', total: stats.total },
                ].map(item => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{item.label}</span>
                      <span className="font-medium text-slate-900">{item.value}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${item.color} transition-all`}
                        style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

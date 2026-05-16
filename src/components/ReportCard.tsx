import { Link } from 'react-router-dom';
import { IncidentReport, CATEGORY_LABELS, STATUS_LABELS, SEVERITY_LABELS, STATUS_COLORS } from '../types';
import { MapPin, Clock, User, ChevronRight } from 'lucide-react';

interface ReportCardProps {
  report: IncidentReport;
  showActions?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function ReportCard({ report, showActions, onApprove, onReject }: ReportCardProps) {
  const statusColor = STATUS_COLORS[report.status];

  const severityBadge = {
    low: 'bg-slate-100 text-slate-700',
    medium: 'bg-amber-100 text-amber-700',
    high: 'bg-orange-100 text-orange-700',
    critical: 'bg-red-100 text-red-700',
  };

  const statusBadge = {
    pending: 'bg-amber-50 text-amber-700 ring-amber-600/20',
    under_review: 'bg-blue-50 text-blue-700 ring-blue-600/20',
    approved: 'bg-green-50 text-green-700 ring-green-600/20',
    rejected: 'bg-red-50 text-red-700 ring-red-600/20',
    resolved: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-slate-300 hover:shadow-md">
      {/* Status indicator bar */}
      <div className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: statusColor }} />

      <div className="p-5 pl-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-2">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${statusBadge[report.status]}`}>
                {STATUS_LABELS[report.status]}
              </span>
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${severityBadge[report.severity]}`}>
                {SEVERITY_LABELS[report.severity]}
              </span>
              <span className="text-xs text-slate-400">{report.id}</span>
            </div>

            {/* Title */}
            <Link to={`/reports/${report.id}`} className="block">
              <h3 className="text-base font-semibold text-slate-900 transition-colors group-hover:text-blue-600">
                {report.title}
              </h3>
            </Link>

            {/* Description preview */}
            <p className="line-clamp-2 text-sm text-slate-500">
              {report.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                {CATEGORY_LABELS[report.category]}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {report.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(report.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1">
                <User className="h-3 w-3" />
                {report.isAnonymous ? 'Anonymous' : report.reporterName}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            {showActions && report.status === 'pending' && (
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove?.(report.id)}
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => onReject?.(report.id)}
                  className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-colors hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            )}
            <Link
              to={`/reports/${report.id}`}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              View
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  SEVERITY_LABELS,
  STATUS_COLORS,
} from '../types';
import {
  ArrowLeft,
  MapPin,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Shield,
  Loader2,
} from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { getReportById, updateReportStatus } = useReports();
  const report = getReportById(id || '');

  const [reviewNotes, setReviewNotes] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'resolve' | null>(null);
  const [processing, setProcessing] = useState(false);

  if (!report) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-slate-50">
        <div className="text-center">
          <FileText className="mx-auto h-16 w-16 text-slate-300" />
          <h2 className="mt-4 text-xl font-bold text-slate-900">Report Not Found</h2>
          <p className="mt-2 text-slate-500">The report you're looking for doesn't exist.</p>
          <Link to="/dashboard" className="mt-4 inline-block rounded-lg bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = STATUS_COLORS[report.status];

  const severityBadge = {
    low: 'bg-slate-100 text-slate-700 border-slate-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
  };

  const statusBadge = {
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
    under_review: 'bg-blue-50 text-blue-700 border-blue-200',
    approved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const handleAction = async () => {
    if (!actionType) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const statusMap = {
      approve: 'approved' as const,
      reject: 'rejected' as const,
      resolve: 'resolved' as const,
    };

    updateReportStatus(report.id, statusMap[actionType], reviewNotes || undefined, user?.id);
    setProcessing(false);
    setShowReviewForm(false);
    setActionType(null);
    setReviewNotes('');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-sm font-medium ${statusBadge[report.status]}`}>
                  {STATUS_LABELS[report.status]}
                </span>
                <span className={`inline-flex items-center rounded-lg border px-3 py-1 text-sm font-medium ${severityBadge[report.severity]}`}>
                  {SEVERITY_LABELS[report.severity]} Severity
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-bold text-slate-900">{report.title}</h1>
              <p className="mt-1 text-sm text-slate-500">Report ID: {report.id}</p>
            </div>

            {/* Admin Actions */}
            {isAdmin() && (report.status === 'pending' || report.status === 'under_review') && (
              <div className="flex gap-2">
                <button
                  onClick={() => { setActionType('approve'); setShowReviewForm(true); }}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </button>
                <button
                  onClick={() => { setActionType('reject'); setShowReviewForm(true); }}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </button>
              </div>
            )}
            {isAdmin() && report.status === 'approved' && (
              <div className="flex gap-2">
                <button
                  onClick={() => { setActionType('resolve'); setShowReviewForm(true); }}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <Shield className="h-4 w-4" />
                  Resolve
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <h3 className="text-lg font-bold text-slate-900">
                {actionType === 'approve' ? 'Approve Report' : actionType === 'reject' ? 'Reject Report' : 'Resolve Report'}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {actionType === 'approve'
                  ? 'This report will be marked as approved and the reporter will be notified.'
                  : actionType === 'reject'
                  ? 'Please provide a reason for rejecting this report.'
                  : 'Mark this incident as resolved and provide resolution notes.'}
              </p>
              <textarea
                value={reviewNotes}
                onChange={e => setReviewNotes(e.target.value)}
                placeholder={
                  actionType === 'approve'
                    ? 'Optional: Add verification notes...'
                    : actionType === 'reject'
                    ? 'Required: Reason for rejection...'
                    : 'Required: Resolution details...'
                }
                rows={3}
                className="mt-4 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => { setShowReviewForm(false); setActionType(null); setReviewNotes(''); }}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAction}
                  disabled={processing || (actionType !== 'approve' && !reviewNotes)}
                  className={`flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors disabled:opacity-50 ${
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : actionType === 'reject'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm {actionType === 'approve' ? 'Approval' : actionType === 'reject' ? 'Rejection' : 'Resolution'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">
            {/* Description */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Incident Description</h2>
              <p className="mt-4 leading-relaxed text-slate-600">{report.description}</p>
            </div>

            {/* Evidence */}
            {report.evidenceDescription && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Evidence</h2>
                <p className="mt-4 leading-relaxed text-slate-600">{report.evidenceDescription}</p>
              </div>
            )}

            {/* Review Notes */}
            {report.reviewNotes && (
              <div className={`rounded-2xl border p-6 shadow-sm ${
                report.status === 'rejected'
                  ? 'border-red-200 bg-red-50'
                  : report.status === 'approved'
                  ? 'border-green-200 bg-green-50'
                  : 'border-blue-200 bg-blue-50'
              }`}>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-slate-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Review Notes</h2>
                </div>
                <p className="mt-3 text-slate-700">{report.reviewNotes}</p>
                {report.reviewedBy && (
                  <p className="mt-2 text-sm text-slate-500">
                    Reviewed on {report.reviewedAt ? formatDate(report.reviewedAt) : 'N/A'}
                  </p>
                )}
              </div>
            )}

            {/* Resolution */}
            {report.resolutionNotes && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h2 className="text-lg font-semibold text-emerald-900">Resolution</h2>
                </div>
                <p className="mt-3 text-emerald-800">{report.resolutionNotes}</p>
              </div>
            )}

            {/* Timeline */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Timeline</h2>
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <div className="h-full w-0.5 bg-slate-200" />
                  </div>
                  <div className="pb-4">
                    <p className="text-sm font-medium text-slate-900">Report Submitted</p>
                    <p className="text-xs text-slate-500">{formatDate(report.createdAt)}</p>
                  </div>
                </div>
                {report.reviewedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`h-3 w-3 rounded-full ${
                        report.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'
                      }`} />
                      {report.resolutionNotes && <div className="h-full w-0.5 bg-slate-200" />}
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium text-slate-900">
                        Report {report.status === 'approved' ? 'Approved' : report.status === 'rejected' ? 'Rejected' : 'Reviewed'}
                      </p>
                      <p className="text-xs text-slate-500">{formatDate(report.reviewedAt)}</p>
                    </div>
                  </div>
                )}
                {report.resolutionNotes && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">Case Resolved</p>
                      <p className="text-xs text-slate-500">{formatDate(report.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Report Details</h3>
              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-slate-500">Category</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{CATEGORY_LABELS[report.category]}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Location</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-medium text-slate-900">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {report.location}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Barangay</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{report.barangay}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Reported</dt>
                  <dd className="mt-0.5 flex items-center gap-1 font-medium text-slate-900">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    {formatDate(report.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-500">Last Updated</dt>
                  <dd className="mt-0.5 font-medium text-slate-900">{formatDate(report.updatedAt)}</dd>
                </div>
              </dl>
            </div>

            {/* Reporter */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Reporter</h3>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  {report.isAnonymous ? '?' : report.reporterName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {report.isAnonymous ? 'Anonymous Reporter' : report.reporterName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {report.isAnonymous ? 'Identity hidden' : 'Verified resident'}
                  </p>
                </div>
              </div>
              {report.witnessName && (
                <div className="mt-4 border-t border-slate-100 pt-4">
                  <p className="text-xs text-slate-500">Witness</p>
                  <p className="text-sm font-medium text-slate-900">{report.witnessName}</p>
                  {report.witnessContact && (
                    <p className="text-xs text-slate-500">{report.witnessContact}</p>
                  )}
                </div>
              )}
            </div>

            {/* Status indicator */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Status</h3>
              <div className="mt-4">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: statusColor }} />
                  <span className="text-sm font-semibold" style={{ color: statusColor }}>
                    {STATUS_LABELS[report.status]}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {['pending', 'under_review', 'approved', 'resolved'].map((s, i) => {
                    const statusOrder = ['pending', 'under_review', 'approved', 'resolved'];
                    const currentIndex = statusOrder.indexOf(report.status);
                    const isComplete = i <= currentIndex && report.status !== 'rejected';
                    const isCurrent = s === report.status;

                    return (
                      <div key={s} className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          isCurrent ? 'ring-2 ring-offset-1' : ''
                        } ${
                          isComplete ? 'bg-green-500 ring-green-500' : 'bg-slate-200'
                        }`} />
                        <span className={`text-xs ${isComplete ? 'text-slate-700 font-medium' : 'text-slate-400'}`}>
                          {STATUS_LABELS[s as keyof typeof STATUS_LABELS]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

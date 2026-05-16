import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import ReportCard from '../components/ReportCard';
import {
  IncidentStatus,
  IncidentCategory,
  IncidentSeverity,
  CATEGORY_LABELS,
  STATUS_LABELS,
  SEVERITY_LABELS,
} from '../types';
import { Search, Filter, X, FileText } from 'lucide-react';

export default function Reports() {
  const { user, isAdmin } = useAuth();
  const { reports, getReportsByUser, updateReportStatus } = useReports();
  const [searchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>(
    (searchParams.get('status') as IncidentStatus) || 'all'
  );
  const [categoryFilter, setCategoryFilter] = useState<IncidentCategory | 'all'>('all');
  const [severityFilter, setSeverityFilter] = useState<IncidentSeverity | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const allReports = isAdmin() ? reports : getReportsByUser(user?.id || '');

  const filteredReports = useMemo(() => {
    return allReports.filter(report => {
      if (statusFilter !== 'all' && report.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && report.category !== categoryFilter) return false;
      if (severityFilter !== 'all' && report.severity !== severityFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return (
          report.title.toLowerCase().includes(s) ||
          report.description.toLowerCase().includes(s) ||
          report.id.toLowerCase().includes(s) ||
          report.location.toLowerCase().includes(s) ||
          report.reporterName.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [allReports, statusFilter, categoryFilter, severityFilter, search]);

  const handleApprove = (id: string) => {
    updateReportStatus(id, 'approved', 'Verified by responding officer.', user?.id);
  };

  const handleReject = (id: string) => {
    updateReportStatus(id, 'rejected', 'Insufficient evidence provided.', user?.id);
  };

  const activeFilters = [statusFilter, categoryFilter, severityFilter].filter(f => f !== 'all').length;

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            {isAdmin() ? 'All Incident Reports' : 'My Reports'}
          </h1>
          <p className="mt-1 text-slate-500">
            {isAdmin()
              ? 'View, filter, and manage all submitted incident reports.'
              : 'View and track all your submitted incident reports.'}
          </p>
        </div>

        {/* Search & Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search reports by title, ID, location, or reporter..."
                className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-colors ${
                showFilters || activeFilters > 0
                  ? 'border-blue-300 bg-blue-50 text-blue-700'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {activeFilters > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Status</label>
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value as IncidentStatus | 'all')}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">All Statuses</option>
                    {(Object.entries(STATUS_LABELS) as [IncidentStatus, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value as IncidentCategory | 'all')}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">All Categories</option>
                    {(Object.entries(CATEGORY_LABELS) as [IncidentCategory, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Severity</label>
                  <select
                    value={severityFilter}
                    onChange={e => setSeverityFilter(e.target.value as IncidentSeverity | 'all')}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="all">All Severities</option>
                    {(Object.entries(SEVERITY_LABELS) as [IncidentSeverity, string][]).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>
              </div>
              {activeFilters > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setCategoryFilter('all');
                    setSeverityFilter('all');
                  }}
                  className="mt-3 flex items-center gap-1 text-sm text-red-600 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4">
          <p className="text-sm text-slate-500">
            Showing {filteredReports.length} of {allReports.length} reports
          </p>
        </div>

        {/* Reports list */}
        <div className="space-y-3">
          {filteredReports.length > 0 ? (
            filteredReports.map(report => (
              <ReportCard
                key={report.id}
                report={report}
                showActions={isAdmin()}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">No reports found</h3>
              <p className="mt-2 text-sm text-slate-500">
                {search || activeFilters > 0
                  ? 'Try adjusting your search or filters.'
                  : 'No reports have been submitted yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

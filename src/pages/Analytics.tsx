import { useMemo } from 'react';
import { useReports } from '../context/ReportContext';
import {
  IncidentCategory,
  CATEGORY_LABELS,
  STATUS_LABELS,
  SEVERITY_LABELS,
  CATEGORY_COLORS,
  STATUS_COLORS,
} from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  AlertTriangle,
  MapPin,
  Calendar,
  BarChart3,
} from 'lucide-react';

export default function Analytics() {
  const { reports } = useReports();

  // Category distribution
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(CATEGORY_LABELS).map(([key, label]) => ({
      name: label,
      value: counts[key] || 0,
      color: CATEGORY_COLORS[key as IncidentCategory],
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value);
  }, [reports]);

  // Status distribution
  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(STATUS_LABELS).map(([key, label]) => ({
      name: label,
      value: counts[key] || 0,
      color: STATUS_COLORS[key as keyof typeof STATUS_COLORS],
    })).filter(d => d.value > 0);
  }, [reports]);

  // Severity distribution
  const severityData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.severity] = (counts[r.severity] || 0) + 1;
    });
    return Object.entries(SEVERITY_LABELS).map(([key, label]) => ({
      name: label,
      value: counts[key] || 0,
    }));
  }, [reports]);

  // Monthly trend (last 6 months)
  const monthlyTrend = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }

    reports.forEach(r => {
      const d = new Date(r.createdAt);
      const key = d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) {
        months[key]++;
      }
    });

    return Object.entries(months).map(([name, count]) => ({ name, count }));
  }, [reports]);

  // Barangay distribution
  const barangayData = useMemo(() => {
    const counts: Record<string, number> = {};
    reports.forEach(r => {
      counts[r.barangay] = (counts[r.barangay] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.replace('Brgy. ', ''), value }))
      .sort((a, b) => b.value - a.value);
  }, [reports]);

  // Day of week distribution
  const dayOfWeekData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = new Array(7).fill(0);
    reports.forEach(r => {
      const day = new Date(r.createdAt).getDay();
      counts[day]++;
    });
    return days.map((name, i) => ({ name, count: counts[i] }));
  }, [reports]);

  // Category by status stacked data
  const categoryByStatus = useMemo(() => {
    return Object.entries(CATEGORY_LABELS).map(([key, label]) => {
      const catReports = reports.filter(r => r.category === key);
      return {
        name: label.length > 12 ? label.substring(0, 12) + '...' : label,
        pending: catReports.filter(r => r.status === 'pending').length,
        approved: catReports.filter(r => r.status === 'approved').length,
        rejected: catReports.filter(r => r.status === 'rejected').length,
        resolved: catReports.filter(r => r.status === 'resolved').length,
      };
    }).filter(d => d.pending + d.approved + d.rejected + d.resolved > 0);
  }, [reports]);

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

  const totalReports = reports.length;
  const avgPerDay = (totalReports / 180).toFixed(1);
  const resolutionRate = totalReports > 0
    ? ((reports.filter(r => r.status === 'resolved').length / totalReports) * 100).toFixed(1)
    : '0';
  const mostCommonCategory = categoryData[0]?.name || 'N/A';

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Analytics & Insights</h1>
          <p className="mt-1 text-slate-500">
            Data-driven insights to help improve community safety and resource allocation.
          </p>
        </div>

        {/* Summary stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Reports', value: totalReports, icon: BarChart3, color: 'text-blue-600 bg-blue-100' },
            { label: 'Avg. Per Day', value: avgPerDay, icon: Calendar, color: 'text-purple-600 bg-purple-100' },
            { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
            { label: 'Most Common', value: mostCommonCategory, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
          ].map(stat => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Charts grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Monthly Trend */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Monthly Trend</h3>
            <p className="mt-1 text-sm text-slate-500">Incident reports over the last 6 months</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="url(#colorCount)"
                    name="Reports"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Distribution Pie */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Incident Categories</h3>
            <p className="mt-1 text-sm text-slate-500">Distribution by incident type</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-3">
              {categoryData.slice(0, 6).map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs text-slate-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Status Overview</h3>
            <p className="mt-1 text-sm text-slate-500">Current status of all reports</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" width={100} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="value" radius={[0, 8, 8, 0]} name="Count">
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Day of Week Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Day of Week Pattern</h3>
            <p className="mt-1 text-sm text-slate-500">Which days have the most incidents</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dayOfWeekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Barangay Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <MapPin className="h-5 w-5 text-slate-400" />
              Barangay Hotspots
            </h3>
            <p className="mt-1 text-sm text-slate-500">Incident distribution by barangay</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barangayData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" width={90} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Bar dataKey="value" fill="#f59e0b" radius={[0, 8, 8, 0]} name="Reports" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Severity Distribution */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900">Severity Breakdown</h3>
            <p className="mt-1 text-sm text-slate-500">Incident severity distribution</p>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={severityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {severityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              {severityData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category by Status (Full width) */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900">Category × Status Analysis</h3>
            <p className="mt-1 text-sm text-slate-500">How different incident types are being handled</p>
            <div className="mt-6 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryByStatus}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                  <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending" />
                  <Bar dataKey="approved" stackId="a" fill="#22c55e" name="Approved" />
                  <Bar dataKey="rejected" stackId="a" fill="#ef4444" name="Rejected" />
                  <Bar dataKey="resolved" stackId="a" fill="#10b981" name="Resolved" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
          <h3 className="text-lg font-semibold text-blue-900">Key Insights</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Peak Day',
                value: dayOfWeekData.sort((a, b) => b.count - a.count)[0]?.name || 'N/A',
                description: 'Day with highest incident reports',
              },
              {
                title: 'Top Area',
                value: barangayData[0]?.name || 'N/A',
                description: `${barangayData[0]?.value || 0} reports filed`,
              },
              {
                title: 'Response Rate',
                value: `${resolutionRate}%`,
                description: 'Reports successfully resolved',
              },
            ].map(insight => (
              <div key={insight.title} className="rounded-xl bg-white p-4">
                <p className="text-sm text-slate-500">{insight.title}</p>
                <p className="mt-1 text-xl font-bold text-slate-900">{insight.value}</p>
                <p className="mt-1 text-xs text-slate-400">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

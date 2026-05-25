import { useState, useEffect } from 'react';
import api from '../services/api';
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
  Calendar,
  BarChart3,
} from 'lucide-react';

interface AnalyticsOverview {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  resolved: number;
  underReview: number;
  today: number;
  thisWeek: number;
  totalUsers: number;
}

interface CountEntry {
  name: string;
  value: number;
  color?: string;
}

interface TrendEntry {
  name: string;
  count: number;
}

interface CategoryStatusEntry {
  name: string;
  pending: number;
  approved: number;
  rejected: number;
  resolved: number;
}

export default function Analytics() {
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [categoryData, setCategoryData] = useState<CountEntry[]>([]);
  const [statusData, setStatusData] = useState<CountEntry[]>([]);
  const [severityData, setSeverityData] = useState<CountEntry[]>([]);
  const [monthlyTrend, setMonthlyTrend] = useState<TrendEntry[]>([]);
  const [dayOfWeekData, setDayOfWeekData] = useState<TrendEntry[]>([]);
  const [categoryByStatus, setCategoryByStatus] = useState<CategoryStatusEntry[]>([]);
  const [topBarangay, setTopBarangay] = useState<string>('N/A');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, categoriesRes, statusRes, trendRes, severityRes, daysRes, categoryStatusRes, barangayRes] = await Promise.all([
          api.getAnalyticsOverview(),
          api.getAnalyticsCategories(),
          api.getAnalyticsStatusDistribution(),
          api.getAnalyticsMonthlyTrend(),
          api.getAnalyticsSeverityDistribution(),
          api.getAnalyticsDayOfWeek(),
          api.getAnalyticsCategoryByStatus(),
          api.getAnalyticsBarangayDistribution(),
        ]);

        setOverview(overviewRes);

        setCategoryData(
          (categoriesRes.categories || []).map((row: any) => ({
            name: CATEGORY_LABELS[row.category as IncidentCategory] || row.category,
            value: parseInt(row.count, 10),
            color: CATEGORY_COLORS[row.category as IncidentCategory] || undefined,
          }))
        );

        setStatusData(
          (statusRes.statuses || []).map((row: any) => ({
            name: STATUS_LABELS[row.status as keyof typeof STATUS_LABELS] || row.status,
            value: parseInt(row.count, 10),
            color: STATUS_COLORS[row.status as keyof typeof STATUS_COLORS],
          }))
        );

        setMonthlyTrend(
          (trendRes.trend || []).map((row: any) => ({
            name: row.month,
            count: parseInt(row.count, 10),
          }))
        );

        setSeverityData(
          (severityRes.severities || []).map((row: any) => ({
            name: SEVERITY_LABELS[row.severity as keyof typeof SEVERITY_LABELS] || row.severity,
            value: parseInt(row.count, 10),
          }))
        );

        setDayOfWeekData(
          (daysRes.days || []).map((row: any) => ({
            name: row.day,
            count: parseInt(row.count, 10),
          }))
        );

        setCategoryByStatus(
          Object.entries(categoryStatusRes.data || {}).map(([category, statusCounts]) => {
            const counts = statusCounts as any;
            return {
              name: CATEGORY_LABELS[category as IncidentCategory] || category,
              pending: parseInt(counts.pending || 0, 10),
              approved: parseInt(counts.approved || 0, 10),
              rejected: parseInt(counts.rejected || 0, 10),
              resolved: parseInt(counts.resolved || 0, 10),
            };
          })
        );

        const sortedBarangays = (barangayRes.barangays || [])
          .map((row: any) => ({
            name: String(row.barangay).replace('Brgy. ', ''),
            value: parseInt(row.count, 10),
          }))
          .sort((a: any, b: any) => b.value - a.value);

        setTopBarangay(sortedBarangays[0]?.name || 'N/A');
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899'];

  const totalReports = overview?.total ?? 0;
  const dailyReports = overview?.today ?? 0;
  const weeklyReports = overview?.thisWeek ?? 0;
  const resolutionRate = totalReports > 0
    ? ((overview?.resolved ?? 0) / totalReports * 100).toFixed(1)
    : '0';
  const mostCommonCategory = categoryData[0]?.name || 'N/A';

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50 px-4">
        <div className="rounded-2xl bg-white px-6 py-6 shadow-sm">
          <p className="text-lg font-medium text-slate-900">Loading analytics…</p>
          <p className="mt-2 text-sm text-slate-500">Fetching the latest database-driven insights.</p>
        </div>
      </div>
    );
  }

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
            { label: "Today's Reports", value: dailyReports, icon: Calendar, color: 'text-purple-600 bg-purple-100' },
            { label: 'This Week', value: weeklyReports, icon: TrendingUp, color: 'text-green-600 bg-green-100' },
            { label: 'Resolution Rate', value: `${resolutionRate}%`, icon: AlertTriangle, color: 'text-amber-600 bg-amber-100' },
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
                title: 'Top Category',
                value: mostCommonCategory,
                description: 'Most frequently reported incident type',
              },
              {
                title: 'Top Area',
                value: topBarangay || 'N/A',
                description: 'Most reported barangay',
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

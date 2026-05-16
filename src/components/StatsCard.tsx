import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: typeof LucideIcon;
  color: 'blue' | 'amber' | 'green' | 'red' | 'purple' | 'indigo' | 'emerald';
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  subtitle?: string;
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    iconBg: 'bg-blue-100',
    ring: 'ring-blue-500/20',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    iconBg: 'bg-amber-100',
    ring: 'ring-amber-500/20',
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    iconBg: 'bg-green-100',
    ring: 'ring-green-500/20',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    iconBg: 'bg-red-100',
    ring: 'ring-red-500/20',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    iconBg: 'bg-purple-100',
    ring: 'ring-purple-500/20',
  },
  indigo: {
    bg: 'bg-indigo-50',
    icon: 'text-indigo-600',
    iconBg: 'bg-indigo-100',
    ring: 'ring-indigo-500/20',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    ring: 'ring-emerald-500/20',
  },
};

export default function StatsCard({ title, value, icon: Icon, color, change, changeType, subtitle }: StatsCardProps) {
  const classes = colorClasses[color];

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-slate-900">{value}</p>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          {change && (
            <div className="flex items-center gap-1">
              <span
                className={`text-xs font-semibold ${
                  changeType === 'up' ? 'text-green-600' : changeType === 'down' ? 'text-red-600' : 'text-slate-500'
                }`}
              >
                {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : '→'} {change}
              </span>
            </div>
          )}
        </div>
        <div className={`rounded-xl ${classes.iconBg} p-3 ring-1 ${classes.ring}`}>
          <Icon className={`h-6 w-6 ${classes.icon}`} />
        </div>
      </div>
      <div className={`absolute bottom-0 left-0 h-1 w-full ${classes.bg}`} />
    </div>
  );
}

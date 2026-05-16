import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { IncidentReport, IncidentStatus } from '../types';
import { ActivityLog } from '../types';
import api from '../services/api';
import { useAuth } from './AuthContext';

interface ReportContextType {
  reports: IncidentReport[];
  activityLogs: ActivityLog[];
  loading: boolean;
  addReport: (report: any) => Promise<IncidentReport>;
  updateReportStatus: (id: string, status: IncidentStatus, reviewNotes?: string, reviewedBy?: string) => Promise<void>;
  getReportById: (id: string) => IncidentReport | undefined;
  getReportsByUser: (userId: string) => IncidentReport[];
  getFilteredReports: (filters: ReportFilters) => IncidentReport[];
  refreshReports: () => Promise<void>;
}

interface ReportFilters {
  status?: IncidentStatus | 'all';
  category?: string | 'all';
  severity?: string | 'all';
  search?: string;
}

const ReportContext = createContext<ReportContextType | null>(null);

function mapApiReport(report: any): IncidentReport {
  return {
    id: report.id,
    reporterId: report.reporterId,
    reporterName: report.reporterName,
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    status: report.status,
    location: report.location,
    barangay: report.barangay,
    evidenceDescription: report.evidenceDescription,
    witnessName: report.witnessName,
    witnessContact: report.witnessContact,
    isAnonymous: report.isAnonymous,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    reviewedBy: report.reviewedBy,
    reviewedAt: report.reviewedAt,
    reviewNotes: report.reviewNotes,
    resolutionNotes: report.resolutionNotes,
  };
}

export function ReportProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(false);

  const refreshReports = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await api.getReports({ limit: 100 });
      setReports(data.reports.map(mapApiReport));

      // Get logs if admin
      if (user?.role === 'admin' || user?.role === 'superadmin') {
        try {
          const logsData = await api.getActivityLogs(20);
          setActivityLogs(logsData.logs.map(log => ({
            id: log.id,
            action: log.action,
            userId: log.userId,
            userName: log.userName,
            reportId: log.reportId,
            details: log.details,
            timestamp: log.timestamp,
          })));
        } catch {
          // Logs might fail for non-admin
        }
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.role]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const addReport = useCallback(async (reportData: any) => {
    const data = await api.createReport(reportData);
    const newReport = mapApiReport(data.report);
    setReports(prev => [newReport, ...prev]);
    return newReport;
  }, []);

  const updateReportStatus = useCallback(async (id: string, status: IncidentStatus, reviewNotes?: string) => {
    const data = await api.updateReportStatus(id, status, reviewNotes);
    const updatedReport = mapApiReport(data.report);
    setReports(prev => prev.map(r => r.id === id ? updatedReport : r));

    // Refresh logs
    try {
      const logsData = await api.getActivityLogs(20);
      setActivityLogs(logsData.logs.map(log => ({
        id: log.id,
        action: log.action,
        userId: log.userId,
        userName: log.userName,
        reportId: log.reportId,
        details: log.details,
        timestamp: log.timestamp,
      })));
    } catch {
      // Ignore
    }
  }, []);

  const getReportById = useCallback((id: string) => {
    return reports.find(r => r.id === id);
  }, [reports]);

  const getReportsByUser = useCallback((userId: string) => {
    return reports.filter(r => r.reporterId === userId);
  }, [reports]);

  const getFilteredReports = useCallback((filters: ReportFilters) => {
    return reports.filter(report => {
      if (filters.status && filters.status !== 'all' && report.status !== filters.status) return false;
      if (filters.category && filters.category !== 'all' && report.category !== filters.category) return false;
      if (filters.severity && filters.severity !== 'all' && report.severity !== filters.severity) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matchesSearch =
          report.title.toLowerCase().includes(search) ||
          report.description.toLowerCase().includes(search) ||
          report.id.toLowerCase().includes(search) ||
          report.location.toLowerCase().includes(search) ||
          report.reporterName.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      return true;
    });
  }, [reports]);

  return (
    <ReportContext.Provider
      value={{
        reports,
        activityLogs,
        loading,
        addReport,
        updateReportStatus,
        getReportById,
        getReportsByUser,
        getFilteredReports,
        refreshReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
}

export function useReports() {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportProvider');
  }
  return context;
}

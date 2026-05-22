import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

import {
  IncidentReport,
  IncidentStatus,
  ActivityLog,
} from "../types";

import api from "../services/api";
import { useAuth } from "./AuthContext";

interface ReportContextType {
  reports: IncidentReport[];
  activityLogs: ActivityLog[];
  loading: boolean;

  addReport: (
    report: any
  ) => Promise<IncidentReport>;

  updateReportStatus: (
    id: string,
    status: IncidentStatus,
    reviewNotes?: string
  ) => Promise<void>;

  getReportById: (
    id: string
  ) => IncidentReport | undefined;

  getReportsByUser: (
    userId: string
  ) => IncidentReport[];

  getFilteredReports: (
    filters: ReportFilters
  ) => IncidentReport[];

  refreshReports: () => Promise<void>;
}

interface ReportFilters {
  status?: IncidentStatus | "all";
  category?: string | "all";
  severity?: string | "all";
  search?: string;
}

const ReportContext =
  createContext<ReportContextType | null>(
    null
  );

function mapApiReport(
  report: any
): IncidentReport {
  return {
    id: String(report.id),
    reporterId: report.reporterId,
    reporterName: report.reporterName,
    title: report.title,
    description: report.description,
    category: report.category,
    severity: report.severity,
    status: report.status || "pending",
    location: report.location,
    barangay: report.barangay,
    evidenceDescription:
      report.evidenceDescription,
    witnessName: report.witnessName,
    witnessContact:
      report.witnessContact,
    isAnonymous:
      report.isAnonymous || false,
    createdAt:
      report.createdAt ||
      new Date().toISOString(),
    updatedAt:
      report.updatedAt ||
      new Date().toISOString(),
    reviewedBy:
      report.reviewedBy || "",
    reviewedAt:
      report.reviewedAt || "",
    reviewNotes:
      report.reviewNotes || "",
    resolutionNotes:
      report.resolutionNotes || "",
  };
}

export function ReportProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { isAuthenticated } =
    useAuth();

  const [reports, setReports] =
    useState<IncidentReport[]>([]);

  const [activityLogs] =
    useState<ActivityLog[]>([]);

  const [loading, setLoading] =
    useState(false);

  const refreshReports =
    useCallback(async () => {
      if (!isAuthenticated) return;

      try {
        setLoading(true);

        const data =
          await api.getReports();

        const reportList =
          data.reports || data;

        setReports(
          reportList.map(
            mapApiReport
          )
        );
      } catch (error) {
        console.error(
          "Failed fetching reports:",
          error
        );
      } finally {
        setLoading(false);
      }
    }, [isAuthenticated]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const addReport =
    useCallback(
      async (reportData: any) => {
        try {
          const data =
            await api.createReport(
              reportData
            );

          const report =
            data.report || data;

          const newReport =
            mapApiReport(report);

          setReports(prev => [
            newReport,
            ...prev,
          ]);

          return newReport;
        } catch (error) {
          console.error(
            "Create report failed:",
            error
          );
          throw error;
        }
      },
      []
    );

  const updateReportStatus =
    useCallback(
      async (
        id: string,
        status: IncidentStatus,
        reviewNotes?: string
      ) => {
        try {
          const data =
            await api.updateReport(
              id,
              {
                status,
                reviewNotes,
              }
            );

          const updatedReport =
            mapApiReport(
              data.report || data
            );

          setReports(prev =>
            prev.map(r =>
              r.id === id
                ? updatedReport
                : r
            )
          );
        } catch (error) {
          console.error(
            "Update failed:",
            error
          );
        }
      },
      []
    );

  const getReportById =
    useCallback(
      (id: string) => {
        return reports.find(
          r => r.id === id
        );
      },
      [reports]
    );

  const getReportsByUser =
    useCallback(
      (userId: string) => {
        return reports.filter(
          r =>
            r.reporterId === userId
        );
      },
      [reports]
    );

  const getFilteredReports =
    useCallback(
      (
        filters: ReportFilters
      ) => {
        return reports.filter(
          report => {
            if (
              filters.status &&
              filters.status !==
                "all" &&
              report.status !==
                filters.status
            )
              return false;

            if (
              filters.category &&
              filters.category !==
                "all" &&
              report.category !==
                filters.category
            )
              return false;

            if (
              filters.severity &&
              filters.severity !==
                "all" &&
              report.severity !==
                filters.severity
            )
              return false;

            if (
              filters.search
            ) {
              const search =
                filters.search.toLowerCase();

              return (
                report.title
                  .toLowerCase()
                  .includes(
                    search
                  ) ||
                report.description
                  .toLowerCase()
                  .includes(
                    search
                  ) ||
                String(report.id)
                  .toLowerCase()
                  .includes(
                    search
                  )
              );
            }

            return true;
          }
        );
      },
      [reports]
    );

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
  const context =
    useContext(
      ReportContext
    );

  if (!context) {
    throw new Error(
      "useReports must be used within ReportProvider"
    );
  }

  return context;
}
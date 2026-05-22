import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useReports } from '../context/ReportContext';
import {
  IncidentCategory,
  IncidentSeverity,
  CATEGORY_LABELS,
  SEVERITY_LABELS,
} from '../types';
import {
  AlertTriangle,
  MapPin,
  FileText,
  User,
  Eye,
  EyeOff,
  Upload,
  Loader2,
  CheckCircle2,
  Info,
  ArrowLeft,
} from 'lucide-react';

export default function ReportIncident() {
  const { user } = useAuth();
  const { addReport } = useReports();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [reportId, setReportId] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '' as IncidentCategory | '',
    severity: '' as IncidentSeverity | '',
    location: '',
    barangay: 'Brgy. San Antonio',
    evidenceDescription: '',
    witnessName: '',
    witnessContact: '',
    isAnonymous: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  if (!user) {
    alert("You must be logged in");
    return;
  }

  try {
    setLoading(true);

    const report = await addReport({
      reporterId: user.id,
      reporterName: formData.isAnonymous
        ? "Anonymous"
        : user.name,

      title: formData.title,
      description: formData.description,
      category: formData.category,
      severity: formData.severity,
      location: formData.location,
      barangay: formData.barangay,
      evidenceDescription: formData.evidenceDescription,
      witnessName: formData.witnessName,
      witnessContact: formData.witnessContact,
      isAnonymous: formData.isAnonymous,
    });

    console.log("REPORT CREATED:", report);

    // safer fallback if id doesn't exist
    setReportId(
      report?.id?.toString() ||
      Date.now().toString()
    );

    setSuccess(true);

  } catch (error: any) {
    console.error("SUBMIT ERROR:", error);

    alert(
      error?.message ||
      "Failed to submit report"
    );
  } finally {
    // always stop spinner
    setLoading(false);
  }
};
  const canProceedStep1 = formData.category && formData.severity;
  const canProceedStep2 = formData.title && formData.description && formData.location;

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-gradient-to-br from-slate-50 to-green-50 px-4">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Report Submitted!</h2>
          <p className="text-slate-500">
            Your incident report has been submitted successfully. Barangay officials will review your report within 24-48 hours.
          </p>
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-800">Report ID: {reportId}</p>
            <p className="mt-1 text-xs text-green-600">Save this ID to track your report status</p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate(`/reports/${reportId}`)}
              className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              View Report Details
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Report an Incident</h1>
          <p className="mt-2 text-slate-500">
            Provide details about the incident. All information will be kept confidential.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Classification' },
              { num: 2, label: 'Details' },
              { num: 3, label: 'Evidence' },
            ].map((s, i) => (
              <div key={s.num} className="flex items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                    step >= s.num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </div>
                <span className={`ml-2 text-sm font-medium ${step >= s.num ? 'text-blue-600' : 'text-slate-400'}`}>
                  {s.label}
                </span>
                {i < 2 && (
                  <div className={`mx-4 h-0.5 w-16 sm:w-24 ${step > s.num ? 'bg-blue-600' : 'bg-slate-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          {/* Step 1: Classification */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 rounded-xl bg-amber-50 p-4">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800">
                  Select the type and severity of the incident you're reporting.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Incident Category <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {(Object.entries(CATEGORY_LABELS) as [IncidentCategory, string][]).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, category: value }))}
                      className={`rounded-xl border-2 p-3 text-left text-sm transition-all ${
                        formData.category === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Severity Level <span className="text-red-500">*</span>
                </label>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {(Object.entries(SEVERITY_LABELS) as [IncidentSeverity, string][]).map(([value, label]) => {
                    const colors = {
                      low: 'border-slate-300 bg-slate-50 hover:border-slate-400',
                      medium: 'border-amber-300 bg-amber-50 hover:border-amber-400',
                      high: 'border-orange-300 bg-orange-50 hover:border-orange-400',
                      critical: 'border-red-300 bg-red-50 hover:border-red-400',
                    };
                    const selectedColors = {
                      low: 'border-slate-500 bg-slate-100 ring-2 ring-slate-500/20',
                      medium: 'border-amber-500 bg-amber-100 ring-2 ring-amber-500/20',
                      high: 'border-orange-500 bg-orange-100 ring-2 ring-orange-500/20',
                      critical: 'border-red-500 bg-red-100 ring-2 ring-red-500/20',
                    };
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, severity: value }))}
                        className={`rounded-xl border-2 p-3 text-center text-sm font-medium transition-all ${
                          formData.severity === value ? selectedColors[value] : colors[value]
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isAnonymous" className="flex items-center gap-2 text-sm text-slate-700">
                  {formData.isAnonymous ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  Submit anonymously (your identity will be hidden)
                </label>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => canProceedStep1 && setStep(2)}
                  disabled={!canProceedStep1}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Add Details
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                  Incident Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Brief title of the incident"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                  Detailed Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  required
                  rows={5}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Provide a detailed description of what happened, when, and any other relevant information..."
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-slate-700">
                    Incident Location <span className="text-red-500">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Street address or landmark"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="barangay" className="block text-sm font-medium text-slate-700">
                    Barangay
                  </label>
                  <select
                    id="barangay"
                    name="barangay"
                    value={formData.barangay}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option>Brgy. San Antonio</option>
                    <option>Brgy. San Jose</option>
                    <option>Brgy. San Isidro</option>
                    <option>Brgy. Santo Niño</option>
                    <option>Brgy. San Pedro</option>
                    <option>Brgy. Del Pilar</option>
                    <option>Brgy. Rizal</option>
                    <option>Brgy. Mabini</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => canProceedStep2 && setStep(3)}
                  disabled={!canProceedStep2}
                  className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next: Add Evidence
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Evidence */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 rounded-xl bg-blue-50 p-4">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                <p className="text-sm text-blue-800">
                  Adding evidence and witness information strengthens your report and helps officials process it faster.
                </p>
              </div>

              <div>
                <label htmlFor="evidenceDescription" className="block text-sm font-medium text-slate-700">
                  Evidence Description
                </label>
                <textarea
                  id="evidenceDescription"
                  name="evidenceDescription"
                  rows={3}
                  value={formData.evidenceDescription}
                  onChange={handleChange}
                  className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Describe any evidence you have (photos, videos, CCTV footage, documents)..."
                />
              </div>

              {/* Photo upload placeholder */}
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Attach Photos (optional)
                </label>
                <div className="mt-1.5 flex justify-center rounded-xl border-2 border-dashed border-slate-300 px-6 py-10 transition-colors hover:border-blue-400 hover:bg-blue-50/50">
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-slate-400" />
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1 text-xs text-slate-500">PNG, JPG, MP4 up to 10MB each</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="witnessName" className="block text-sm font-medium text-slate-700">
                    Witness Name (optional)
                  </label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      id="witnessName"
                      name="witnessName"
                      type="text"
                      value={formData.witnessName}
                      onChange={handleChange}
                      className="block w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Witness full name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="witnessContact" className="block text-sm font-medium text-slate-700">
                    Witness Contact (optional)
                  </label>
                  <input
                    id="witnessContact"
                    name="witnessContact"
                    type="text"
                    value={formData.witnessContact}
                    onChange={handleChange}
                    className="mt-1.5 block w-full rounded-xl border border-slate-300 px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Phone or email"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-sm font-semibold text-slate-900">Report Summary</h3>
                <dl className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Category:</dt>
                    <dd className="font-medium text-slate-900">{formData.category ? CATEGORY_LABELS[formData.category as IncidentCategory] : '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Severity:</dt>
                    <dd className="font-medium text-slate-900">{formData.severity ? SEVERITY_LABELS[formData.severity as IncidentSeverity] : '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Location:</dt>
                    <dd className="font-medium text-slate-900">{formData.location || '-'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-slate-500">Anonymous:</dt>
                    <dd className="font-medium text-slate-900">{formData.isAnonymous ? 'Yes' : 'No'}</dd>
                  </div>
                </dl>
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:shadow-md hover:brightness-110 disabled:opacity-70"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Submit Report
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

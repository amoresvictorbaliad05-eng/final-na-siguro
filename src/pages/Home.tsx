import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  AlertTriangle,
  BarChart3,
  Clock,
  CheckCircle2,
  MapPin,
  Phone,
  Lock,
  Eye,
  ArrowRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  const features = [
    {
      icon: AlertTriangle,
      title: 'Easy Reporting',
      description: 'Report incidents in under 2 minutes with our streamlined form. Attach photos and provide location details.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: Eye,
      title: 'Real-Time Tracking',
      description: 'Track your report status in real-time. Get notified when officials review, approve, or resolve your case.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Officials access powerful analytics with charts, trends, and hotspot analysis to make data-driven decisions.',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: ShieldCheck,
      title: 'Verified & Secure',
      description: 'Role-based authentication ensures only authorized officials access sensitive data. Your privacy is protected.',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: MapPin,
      title: 'Location Mapping',
      description: 'Pin the exact incident location. View geographic distribution of incidents across community zones.',
      color: 'from-rose-500 to-pink-600',
    },
    {
      icon: Zap,
      title: 'Instant Notifications',
      description: 'Receive instant updates on your reports via in-app notifications. Never miss an important status change.',
      color: 'from-cyan-500 to-teal-600',
    },
  ];

  const steps = [
    { step: '01', title: 'Create Account', description: 'Sign up with your email and verify your identity as a community resident.' },
    { step: '02', title: 'Report Incident', description: 'Fill out the incident form with details, location, severity, and evidence.' },
    { step: '03', title: 'Officials Review', description: 'Local officials review and validate your report within 24-48 hours.' },
    { step: '04', title: 'Case Resolution', description: 'Track progress as officials investigate and resolve the incident.' },
  ];

  const stats = [
    { value: '500+', label: 'Reports Filed' },
    { value: '95%', label: 'Resolution Rate' },
    { value: '<24h', label: 'Response Time' },
    { value: '10K+', label: 'Residents Served' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-300 backdrop-blur">
                <Shield className="h-4 w-4" />
                Official Community Safety Platform
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Keep Your
                <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"> Community Safe</span>
              </h1>

              <p className="max-w-xl text-lg leading-relaxed text-slate-300">
                Report incidents quickly and securely. Our platform connects citizens directly with barangay officials for faster response, transparent tracking, and data-driven community safety.
              </p>

              <div className="flex flex-col gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <Link
                    to={isAdmin() ? '/dashboard' : '/report'}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
                  >
                    {isAdmin() ? 'Go to Dashboard' : 'Report an Incident'}
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:shadow-blue-500/40 hover:brightness-110"
                    >
                      Report an Incident
                      <AlertTriangle className="h-5 w-5" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-600 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
                    >
                      Sign In
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <span className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-400" />
                  Encrypted & Secure
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Government Verified
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-green-400" />
                  24/7 Available
                </span>
              </div>
            </div>

            {/* Hero visual - Stats/Preview card */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-3xl" />
                <div className="relative space-y-4">
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
                      >
                        <p className="text-3xl font-bold text-white">{stat.value}</p>
                        <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Preview report card */}
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Motorcycle Stolen</p>
                        <p className="text-xs text-slate-400">Theft • High Severity • 2h ago</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-medium text-amber-300">
                        Pending Review
                      </span>
                      <span className="text-xs text-slate-500">IR-A3F2K9D1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1200 40 960 60 720 40C480 20 240 40 0 60Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Report incidents in four simple steps. Our streamlined process ensures your report reaches officials quickly.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.step} className="relative text-center">
                {index < steps.length - 1 && (
                  <div className="absolute left-1/2 top-10 hidden h-0.5 w-full -translate-x-0 bg-slate-200 lg:block" style={{ left: '75%' }} />
                )}
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100">
                  <span className="text-2xl font-bold text-blue-600">{step.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Powerful Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-500">
              Everything you need for efficient community incident management and response.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-transparent hover:shadow-lg hover:shadow-slate-200/50"
                >
                  <div className={`inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg transition-transform group-hover:scale-110`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to Make Your Community Safer?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
            Join thousands of residents who are already using Community Incident Reporter to report incidents and keep their community safe.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={isAuthenticated ? '/report' : '/register'}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-xl transition-all hover:bg-blue-50 hover:shadow-2xl"
            >
              Get Started Now
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10"
            >
              <Phone className="h-5 w-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div>
                <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="text-lg font-bold text-slate-900">Community Incident Reporter</span>
              </div>
              <p className="mt-3 text-sm text-slate-500">
                Official Incident Reporting System for community-level safety management.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Quick Links</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
                <li><Link to="/login" className="hover:text-blue-600">Report Incident</Link></li>
                <li><Link to="/login" className="hover:text-blue-600">Check Status</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Emergency</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> 911 Emergency</li>
                <li className="flex items-center gap-2"><Phone className="h-3 w-3" /> Community Hotline</li>
                <li className="flex items-center gap-2"><MapPin className="h-3 w-3" /> Community Hall Address</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Legal</h4>
              <ul className="mt-3 space-y-2 text-sm text-slate-500">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Data Protection</li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} Community Incident Reporter. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

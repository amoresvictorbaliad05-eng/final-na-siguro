import path from "path";
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import reportRoutes from './routes/reports.js';
import userRoutes from './routes/users.js';
import analyticsRoutes from './routes/analytics.js';
import logRoutes from './routes/logs.js';
import notificationRoutes from './routes/notifications.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// =============================================
// API ROUTES
// =============================================
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Barangay Bantay API',
    timestamp: new Date().toISOString(),
    database: 'Aiven PostgreSQL',
  });
});

// =============================================
// ERROR HANDLING
// =============================================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
//app.use((req, res) => {
//  res.status(404).json({ error: 'Route not found' });
//});


const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, "dist")));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
// =============================================
// START SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   🏘️  Barangay Bantay API Server                         ║
  ║                                                          ║
  ║   🚀 Server running on: http://localhost:${PORT}            ║
  ║   📊 Database: Aiven PostgreSQL                          ║
  ║   🔗 Health check: http://localhost:${PORT}/api/health       ║
  ║                                                          ║
  ║   API Endpoints:                                         ║
  ║   • POST   /api/auth/register                            ║
  ║   • POST   /api/auth/login                               ║
  ║   • GET    /api/auth/me                                  ║
  ║   • GET    /api/reports                                  ║
  ║   • POST   /api/reports                                  ║
  ║   • PATCH  /api/reports/:id/status                       ║
  ║   • GET    /api/users                                    ║
  ║   • GET    /api/analytics/*                              ║
  ║   • GET    /api/logs                                     ║
  ║   • GET    /api/notifications                            ║
  ║                                                          ║
  ╚══════════════════════════════════════════════════════════╝
  `);
});

export default app;

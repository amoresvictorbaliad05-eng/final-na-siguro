# ⚡ Quick Start Guide

## 1️⃣ Setup Aiven PostgreSQL

```bash
# Go to https://console.aiven.io
# Create free PostgreSQL service
# Copy connection details
```

## 2️⃣ Configure Environment

```bash
# Copy example env
cp .env.example .env

# Edit .env with your Aiven credentials:
# AIVEN_DB_USER=avnadmin
# AIVEN_DB_PASSWORD=your_password
# AIVEN_DB_HOST=pg-xyz.aivencloud.com
# AIVEN_DB_PORT=22867
# AIVEN_DB_NAME=defaultdb
# AIVEN_CA_CERT=./ca.pem
```

## 3️⃣ Download CA Certificate

```bash
# Download from Aiven Console > Service > Overview
# Save as ca.pem in project root
```

## 4️⃣ Initialize Database

```bash
# Test connection
npm run db:test

# Create tables
npm run db:init

# Seed sample data (50 reports, 6 users)
npm run db:seed
```

## 5️⃣ Start Application

```bash
# Start both servers
npm run dev:full

# Or separately:
npm run server    # Backend (port 3001)
npm run dev       # Frontend (port 5173)
```

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | captain@barangay.gov.ph | admin123 |
| Admin | kagawad@barangay.gov.ph | admin123 |
| Citizen | pedro@email.com | user123 |

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | No | Register |
| POST | /api/auth/login | No | Login |
| GET | /api/auth/me | Yes | Profile |
| GET | /api/reports | Yes | List reports |
| POST | /api/reports | Yes | Create report |
| PATCH | /api/reports/:id/status | Admin | Update status |
| GET | /api/users | Admin | List users |
| GET | /api/analytics/overview | Admin | Dashboard stats |
| GET | /api/notifications | Yes | Get notifications |

## 🛠️ Commands Reference

```bash
npm run dev        # Start Vite dev server
npm run server     # Start Express API server
npm run dev:full   # Start both servers
npm run build      # Build frontend
npm run db:init    # Initialize database
npm run db:seed    # Seed sample data
npm run db:test    # Test Aiven connection
```

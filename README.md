# 🏘️ Barangay Bantay - Incident Reporting & Analytics System

A full-stack web application for barangay-level incident reporting with Node.js backend and Aiven PostgreSQL database.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + TypeScript + Vite + Tailwind CSS |
| **Backend** | Node.js + Express.js + TypeScript |
| **Database** | Aiven PostgreSQL (managed cloud) |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Charts** | Recharts |
| **Icons** | Lucide React |

## 📋 Prerequisites

- Node.js 18+ installed
- An [Aiven](https://aiven.io) account (free tier available)
- PostgreSQL service created on Aiven

## 🔧 Aiven PostgreSQL Setup

### Step 1: Create Aiven Account & Service

1. Go to [Aiven Console](https://console.aiven.io)
2. Sign up for a free account
3. Click **"Create Service"**
4. Select **PostgreSQL**
5. Choose your preferred cloud region
6. Select the **Free Plan** (or paid for production)
7. Click **"Create Service"**

### Step 2: Get Connection Details

Once your service is running:

1. Go to your service **Overview** page
2. Find **Connection Information** section
3. Copy these values:
   - **Host** (e.g., `pg-xyz.aivencloud.com`)
   - **Port** (e.g., `22867`)
   - **User** (e.g., `avnadmin`)
   - **Password**
   - **Database** (e.g., `defaultdb`)

4. Download the **CA Certificate** (click "Download CA cert")

### Step 3: Configure Environment

```bash
# Copy the example env file
cp .env.example .env
```

Edit `.env` with your Aiven credentials:

```env
# Server
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-key

# Aiven PostgreSQL
AIVEN_DB_USER=avnadmin
AIVEN_DB_PASSWORD=your_password_here
AIVEN_DB_HOST=pg-xyz.aivencloud.com
AIVEN_DB_PORT=22867
AIVEN_DB_NAME=defaultdb

# CA Certificate (paste the downloaded cert content)
AIVEN_CA_CERT=./ca.pem
```

## 🏃‍♂️ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Initialize database (creates tables)
npm run db:init

# 3. Seed with sample data
npm run db:seed

# 4. Start both frontend and backend
npm run dev:full
```

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite frontend dev server |
| `npm run server` | Start Node.js backend server |
| `npm run dev:full` | Start both frontend & backend |
| `npm run build` | Build frontend for production |
| `npm run db:init` | Initialize database schema |
| `npm run db:seed` | Seed database with sample data |

## 🔐 Demo Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| **Super Admin** | captain@barangay.gov.ph | admin123 |
| **Admin** | kagawad@barangay.gov.ph | admin123 |
| **Citizen** | pedro@email.com | user123 |
| **Citizen** | ana@email.com | user123 |

## 📁 Project Structure

```
barangay-bantay/
├── server/                    # Node.js Backend
│   ├── db/
│   │   ├── index.ts          # Aiven PostgreSQL connection
│   │   ├── schema.sql        # Database schema
│   │   ├── seed.ts           # Sample data seeder
│   │   └── init.ts           # Database initializer
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication
│   ├── routes/
│   │   ├── auth.ts           # Login/Register/Profile
│   │   ├── reports.ts        # CRUD for reports
│   │   ├── users.ts          # User management
│   │   ├── analytics.ts      # Analytics endpoints
│   │   ├── logs.ts           # Activity logs
│   │   └── notifications.ts  # Notifications
│   └── index.ts              # Express server entry
│
├── src/                       # React Frontend
│   ├── components/           # Reusable UI components
│   ├── context/              # React Context (Auth, Reports)
│   ├── pages/                # Page components
│   ├── services/             # API service layer
│   └── types/                # TypeScript types
│
├── .env                       # Environment variables
├── .env.example               # Env template
└── package.json
```

## 🗄️ Database Schema

### Users Table
- `id` (UUID, PK)
- `name`, `email`, `password_hash`
- `phone`, `address`, `barangay`
- `role` (citizen/admin/superadmin)
- `is_verified`, `created_at`, `updated_at`

### Reports Table
- `id` (UUID, PK)
- `report_number` (IR-XXXXXXXX)
- `reporter_id` (FK → users)
- `title`, `description`
- `category`, `severity`, `status`
- `location`, `barangay`
- `evidence_description`
- `witness_name`, `witness_contact`
- `is_anonymous`
- `reviewed_by` (FK → users)
- `review_notes`, `resolution_notes`
- `created_at`, `updated_at`

### Activity Logs Table
- `id` (UUID, PK)
- `action`, `user_id`, `user_name`
- `report_id`, `details`
- `created_at`

### Notifications Table
- `id` (UUID, PK)
- `user_id` (FK → users)
- `title`, `message`, `type`
- `is_read`, `related_report_id`
- `created_at`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Reports
- `GET /api/reports` - List reports (filtered)
- `GET /api/reports/:id` - Get report details
- `POST /api/reports` - Create report
- `PATCH /api/reports/:id/status` - Update status (admin)

### Users (Admin)
- `GET /api/users` - List users
- `PATCH /api/users/:id/verify` - Verify user

### Analytics (Admin)
- `GET /api/analytics/overview` - Dashboard stats
- `GET /api/analytics/categories` - By category
- `GET /api/analytics/status-distribution` - By status
- `GET /api/analytics/monthly-trend` - Monthly trend
- `GET /api/analytics/barangay-distribution` - By barangay
- `GET /api/analytics/severity-distribution` - By severity
- `GET /api/analytics/day-of-week` - By day
- `GET /api/analytics/category-by-status` - Cross analysis

### Notifications
- `GET /api/notifications` - Get notifications
- `PATCH /api/notifications/:id/read` - Mark as read
- `PATCH /api/notifications/read-all` - Mark all read

## 🚀 Deployment

### Backend (Node.js)

Deploy to any Node.js hosting:
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Fly.io**: `fly deploy`
- **VPS**: Use PM2

### Frontend

Deploy to static hosting:
- **Vercel**: `vercel deploy`
- **Netlify**: Connect GitHub repo
- **Cloudflare Pages**: Connect repo

### Environment Variables (Production)

```env
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=very-long-random-secret
AIVEN_DB_USER=avnadmin
AIVEN_DB_PASSWORD=strong-password
AIVEN_DB_HOST=pg-xyz.aivencloud.com
AIVEN_DB_PORT=22867
AIVEN_DB_NAME=defaultdb
AIVEN_CA_CERT=<paste-ca-cert-content>
```

## 🔒 Security Features

- JWT authentication with 7-day expiry
- Password hashing with bcrypt (10 rounds)
- Role-based access control (RBAC)
- SQL injection prevention (parameterized queries)
- CORS configuration
- Input validation with express-validator

## 📊 Features

### For Citizens
- ✅ Register and verify account
- ✅ Report incidents with 3-step form
- ✅ Anonymous reporting option
- ✅ Track report status in real-time
- ✅ Receive notifications

### For Barangay Officials
- ✅ Dashboard with key metrics
- ✅ Review and approve/reject reports
- ✅ Resolve cases with notes
- ✅ Analytics with 7+ chart types
- ✅ User management
- ✅ Activity audit logs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

# CreditJambo Admin Dashboard

Professional admin dashboard for managing CreditJambo platform - users, credits, analytics, and more.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Setup](#docker-setup)
- [Manual Setup](#manual-setup)
- [Environment Variables](#environment-variables)
- [Features](#features)
- [Development](#development)
- [Deployment](#deployment)

---

## 📁 Project Structure

```
admin/
├── frontend/               # Next.js Admin Dashboard
│   ├── app/                # App router pages
│   │   ├── login/         # Login page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── users/         # Users management
│   │   ├── credits/       # Credits management
│   │   └── analytics/     # Analytics page
│   ├── components/         # React components
│   │   ├── Sidebar.tsx    # Navigation sidebar
│   │   ├── AdminLayout.tsx # Layout wrapper
│   │   ├── Card.tsx       # Card component
│   │   ├── Button.tsx     # Button component
│   │   ├── Input.tsx      # Input component
│   │   └── Alert.tsx      # Alert component
│   ├── lib/                # Utilities and hooks
│   │   ├── api/           # API services
│   │   └── store/         # State management
│   ├── Dockerfile          # Docker configuration
│   └── package.json        # Dependencies
└── README.md              # This file
```

---

## 📦 Prerequisites

### For Docker Setup
- Docker 20.10+
- Docker Compose 2.0+

### For Manual Setup
- Node.js 20+
- npm 10+
- Backend API running (see client/README.md)

---

## 🚀 Quick Start

### Using Docker Compose (Recommended)

```bash
# From root directory
cd creditjambo

# Start all services (includes backend)
docker-compose up -d

# Wait for services to be ready
sleep 40

# Access admin dashboard
# http://localhost:3003
```

### Manual Setup

See [Manual Setup](#manual-setup) section below.

---

## 🐳 Docker Setup

### Prerequisites
- Docker and Docker Compose installed
- Backend API running

### Start Admin Frontend

```bash
# Build and start admin frontend
docker-compose up -d admin-frontend

# View logs
docker-compose logs -f admin-frontend

# Stop service
docker-compose stop admin-frontend
```

### Rebuild Service

```bash
# Rebuild admin frontend image
docker-compose build admin-frontend

# Rebuild and restart
docker-compose up -d --build admin-frontend
```

---

## 🛠️ Manual Setup

### Prerequisites

Ensure the backend API is running:
```bash
cd client/backend
pnpm start:dev
```

### Admin Frontend Setup

```bash
cd admin/frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Start development server
npm run dev

# Or build for production
npm run build
npm start
```

---

## 🔧 Environment Variables

### Frontend (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/admin
```

### For Docker

Environment variables are set in `docker-compose.yml`:

```yaml
environment:
  NEXT_PUBLIC_API_URL: http://localhost:3001/admin
```

---

## ✨ Features

### Dashboard
- 📊 Real-time analytics
- 📈 Interactive charts (Area, Line, Pie, Bar)
- 📋 Quick stats cards
- 🔄 Data refresh

### User Management
- 👥 View all users
- 🔍 Search and filter
- ✏️ Edit user details
- 🗑️ Delete users
- 📊 User statistics

### Credit Management
- 💰 View all credits
- ➕ Create new credit
- ✏️ Edit credit details
- 🗑️ Delete credits
- 📊 Credit analytics

### Analytics
- 📈 Revenue trends
- 👥 User growth
- 💳 Credit distribution
- 💾 Savings overview
- 📊 Custom date ranges

### Security
- 🔐 JWT authentication
- 🔑 Secure login
- 🚪 Logout confirmation
- 🛡️ Role-based access
- 🔄 Token refresh

---

## 💻 Development

### Start Development Server

```bash
cd admin/frontend

# Start with hot reload
npm run dev

# Access at http://localhost:3003
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format
```

### Build for Production

```bash
# Build application
npm run build

# Start production server
npm start
```

---

## 🎨 UI Components

### Available Components

All components are located in `admin/frontend/components/`:

#### Card Component
```typescript
import { Card } from '@/components/Card';

<Card className="w-full max-w-md">
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

#### Button Component
```typescript
import { Button } from '@/components/Button';

<Button
  variant="primary"
  size="lg"
  isLoading={false}
  onClick={() => {}}
>
  Click Me
</Button>
```

#### Input Component
```typescript
import { Input } from '@/components/Input';

<Input
  label="Email"
  type="email"
  placeholder="your@email.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  required
/>
```

#### Alert Component
```typescript
import { Alert } from '@/components/Alert';

<Alert
  type="error"
  message="Error message"
  onClose={() => setError('')}
/>
```

---

## 🔌 API Integration

### Authentication Service

```typescript
import { authService } from '@/lib/api/auth.service';

// Login
const response = await authService.login({
  email: 'admin@creditjambo.com',
  password: 'Admin@123456'
});

// Logout
await authService.logout();
```

### Users Service

```typescript
import { usersService } from '@/lib/api/users.service';

// Get all users
const users = await usersService.getAll();

// Get user by ID
const user = await usersService.getById(id);

// Update user
await usersService.update(id, data);

// Delete user
await usersService.delete(id);
```

### Credits Service

```typescript
import { creditsService } from '@/lib/api/credit.service';

// Get all credits
const credits = await creditsService.getAll();

// Create credit
await creditsService.create(data);

// Update credit
await creditsService.update(id, data);

// Delete credit
await creditsService.delete(id);
```

### Analytics Service

```typescript
import { analyticsService } from '@/lib/api/analytics.service';

// Get dashboard stats
const stats = await analyticsService.getDashboardStats();

// Get revenue data
const revenue = await analyticsService.getRevenueData();

// Get user growth
const growth = await analyticsService.getUserGrowth();
```

---

## 🔐 Default Credentials

```
Email: admin@creditjambo.com
Password: Admin@123456
```

---

## 🚢 Deployment

### Docker Deployment

```bash
# Build production image
docker-compose build admin-frontend

# Start service
docker-compose up -d admin-frontend

# View logs
docker-compose logs -f admin-frontend
```

### Environment for Production

Update `docker-compose.yml`:

```yaml
environment:
  NEXT_PUBLIC_API_URL: https://api.yourdomain.com/admin
```

---

## 🐛 Troubleshooting

### Cannot Connect to Backend

```bash
# Check backend is running
curl http://localhost:3001/api/health

# Check API URL in .env.local
cat .env.local

# Verify CORS configuration
# Backend should have CORS_ORIGIN including admin frontend URL
```

### Port 3003 Already in Use

```bash
# Change port in package.json or docker-compose.yml
# Or kill process using the port
lsof -i :3003
kill -9 <PID>
```

### Build Failures

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

### Login Issues

```bash
# Check credentials
# Email: admin@creditjambo.com
# Password: Admin@123456

# Check backend is running
docker-compose ps

# Check backend logs
docker-compose logs backend
```

---

## 📊 Performance

### Optimization Tips

1. **Image Optimization**: Next.js automatically optimizes images
2. **Code Splitting**: Pages are automatically code-split
3. **Caching**: API responses are cached with Zustand
4. **Lazy Loading**: Components are lazy-loaded when needed

### Monitoring

- Check browser DevTools for performance metrics
- Use Next.js Analytics for page performance
- Monitor API response times in browser Network tab

---

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review API documentation at http://localhost:3001/admin/docs
3. Check application logs
4. Open an issue on GitHub

---

## 📄 License

UNLICENSED

---

**Last Updated**: October 30, 2025


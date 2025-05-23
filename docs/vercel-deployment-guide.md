# 🚀 Panduan Deploy ke Vercel - TaskFlow

Panduan lengkap untuk deploy aplikasi TaskFlow ke Vercel dengan semua konfigurasi yang diperlukan.

## 📋 Prerequisites

### 1. Akun yang Diperlukan
- [x] Akun GitHub (untuk repository)
- [x] Akun Vercel (gratis di [vercel.com](https://vercel.com))
- [x] Akun database (Neon, PlanetScale, atau Supabase)

### 2. Persiapan Lokal
\`\`\`bash
# Pastikan aplikasi berjalan lokal
npm run dev

# Test build production
npm run build

# Pastikan semua test pass
npm test
\`\`\`

## 🔧 Step 1: Persiapan Repository

### 1.1 Push ke GitHub
\`\`\`bash
# Initialize git (jika belum)
git init

# Add remote repository
git remote add origin https://github.com/username/taskflow.git

# Add dan commit semua files
git add .
git commit -m "Initial commit: TaskFlow project"

# Push ke GitHub
git push -u origin main
\`\`\`

### 1.2 Pastikan File Konfigurasi Ada
Pastikan file-file ini ada di root project:

\`\`\`javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs']
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
\`\`\`

\`\`\`json
// package.json - pastikan scripts ini ada
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate"
  }
}
\`\`\`

## 🌐 Step 2: Setup Database Production

### Option A: Neon (Recommended)

1. **Buat akun di [Neon](https://neon.tech)**
2. **Create new project**
3. **Copy connection string**

\`\`\`bash
# Format connection string Neon
postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
\`\`\`

### Option B: Supabase

1. **Buat akun di [Supabase](https://supabase.com)**
2. **Create new project**
3. **Go to Settings > Database**
4. **Copy connection string**

\`\`\`bash
# Format connection string Supabase
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
\`\`\`

### Option C: PlanetScale

1. **Buat akun di [PlanetScale](https://planetscale.com)**
2. **Create new database**
3. **Create branch (main)**
4. **Get connection string**

\`\`\`bash
# Format connection string PlanetScale
mysql://username:password@aws.connect.psdb.cloud/database-name?sslaccept=strict
\`\`\`

## 🚀 Step 3: Deploy ke Vercel

### 3.1 Import Project ke Vercel

1. **Login ke [Vercel](https://vercel.com)**
2. **Click "New Project"**
3. **Import dari GitHub**
4. **Pilih repository TaskFlow**
5. **Configure project:**

\`\`\`bash
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
\`\`\`

### 3.2 Setup Environment Variables

Di Vercel dashboard, masuk ke **Settings > Environment Variables** dan tambahkan:

#### Database Configuration
\`\`\`bash
# Database
DATABASE_URL=postgresql://username:password@host:5432/database
DATABASE_URL_UNPOOLED=postgresql://username:password@host:5432/database

# Untuk PlanetScale, gunakan:
# DATABASE_URL=mysql://username:password@host/database?sslaccept=strict
\`\`\`

#### Authentication Configuration
\`\`\`bash
# NextAuth
NEXTAUTH_SECRET=your-super-secret-key-min-32-characters
NEXTAUTH_URL=https://your-app-name.vercel.app

# Generate secret dengan:
# openssl rand -base64 32
\`\`\`

#### Email Configuration (Optional)
\`\`\`bash
# Email provider (contoh dengan Gmail)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com
\`\`\`

#### Monitoring (Optional)
\`\`\`bash
# Sentry
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your-analytics-id
\`\`\`

### 3.3 Deploy

1. **Click "Deploy"**
2. **Wait for build to complete**
3. **Check deployment logs jika ada error**

## 🗄️ Step 4: Setup Database Schema

### 4.1 Run Migrations

Setelah deployment berhasil, setup database schema:

\`\`\`bash
# Option 1: Via Vercel CLI (recommended)
npx vercel env pull .env.local
npx prisma migrate deploy
npx prisma db seed

# Option 2: Via GitHub Actions (otomatis)
# Sudah dikonfigurasi di .github/workflows/ci.yml
\`\`\`

### 4.2 Verify Database

\`\`\`bash
# Test database connection
npx prisma studio

# Atau buat test user via Prisma Studio
# Atau via aplikasi setelah deploy
\`\`\`

## 🔧 Step 5: Konfigurasi Domain (Optional)

### 5.1 Custom Domain

1. **Di Vercel dashboard > Settings > Domains**
2. **Add domain: yourdomain.com**
3. **Configure DNS records:**

\`\`\`bash
# A Record
Type: A
Name: @
Value: 76.76.19.61

# CNAME Record
Type: CNAME
Name: www
Value: cname.vercel-dns.com
\`\`\`

### 5.2 Update Environment Variables

\`\`\`bash
# Update NEXTAUTH_URL
NEXTAUTH_URL=https://yourdomain.com
\`\`\`

## 🔍 Step 6: Verifikasi Deployment

### 6.1 Test Functionality

1. **Buka aplikasi di browser**
2. **Test signup/login**
3. **Test create project**
4. **Test create task**
5. **Check responsive design**

### 6.2 Check Performance

\`\`\`bash
# Lighthouse audit
npx lighthouse https://your-app.vercel.app

# Vercel Analytics
# Check di Vercel dashboard > Analytics
\`\`\`

### 6.3 Monitor Errors

\`\`\`bash
# Check Vercel logs
vercel logs

# Check Sentry (jika dikonfigurasi)
# https://sentry.io/organizations/your-org/issues/
\`\`\`

## 🔄 Step 7: Setup CI/CD (Automatic Deployment)

### 7.1 GitHub Actions (Already Configured)

File `.github/workflows/ci.yml` sudah dikonfigurasi untuk:
- ✅ Run tests on PR
- ✅ Deploy to Vercel on merge to main
- ✅ Run database migrations
- ✅ Performance testing

### 7.2 Vercel Git Integration

Vercel otomatis akan:
- 🔄 Deploy setiap push ke main branch
- 🔍 Create preview deployment untuk PR
- 📊 Run build checks
- 🚨 Send notifications jika build gagal

## 🛠️ Troubleshooting

### Build Errors

#### Error: "Module not found"
\`\`\`bash
# Solution: Check imports dan dependencies
npm install
npm run build

# Check next.config.mjs configuration
\`\`\`

#### Error: "Prisma Client not generated"
\`\`\`bash
# Solution: Add postinstall script
# package.json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
\`\`\`

#### Error: "Environment variable not found"
\`\`\`bash
# Solution: Check environment variables di Vercel
# Settings > Environment Variables
# Pastikan semua required variables ada
\`\`\`

### Database Connection Errors

#### Error: "Can't reach database server"
\`\`\`bash
# Solution: Check connection string format
# Pastikan database accessible dari internet
# Check firewall settings
\`\`\`

#### Error: "SSL connection required"
\`\`\`bash
# Solution: Add SSL parameter
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
\`\`\`

### Authentication Errors

#### Error: "NEXTAUTH_URL mismatch"
\`\`\`bash
# Solution: Update NEXTAUTH_URL
NEXTAUTH_URL=https://your-actual-domain.vercel.app
\`\`\`

#### Error: "Invalid NEXTAUTH_SECRET"
\`\`\`bash
# Solution: Generate new secret
openssl rand -base64 32
# Add to environment variables
\`\`\`

### Performance Issues

#### Slow Cold Starts
\`\`\`javascript
// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  }
}
\`\`\`

#### Large Bundle Size
\`\`\`bash
# Analyze bundle
npm run analyze

# Check for unnecessary imports
# Use dynamic imports untuk large components
\`\`\`

## 📊 Monitoring & Maintenance

### 1. Vercel Analytics
- Page views dan performance metrics
- Core Web Vitals tracking
- User behavior insights

### 2. Error Tracking
\`\`\`bash
# Sentry integration untuk error tracking
# Real-time error notifications
# Performance monitoring
\`\`\`

### 3. Database Monitoring
\`\`\`bash
# Monitor database performance
# Check connection pool usage
# Monitor query performance
\`\`\`

### 4. Uptime Monitoring
\`\`\`bash
# Setup uptime monitoring
# Health check endpoints
# Alert notifications
\`\`\`

## 🔐 Security Best Practices

### 1. Environment Variables
\`\`\`bash
# Never commit secrets to git
# Use Vercel environment variables
# Rotate secrets regularly
# Use different secrets for different environments
\`\`\`

### 2. Database Security
\`\`\`bash
# Use connection pooling
# Enable SSL connections
# Regular backups
# Monitor for suspicious activity
\`\`\`

### 3. Application Security
\`\`\`bash
# Keep dependencies updated
# Use HTTPS only
# Implement rate limiting
# Regular security audits
\`\`\`

## 🚀 Post-Deployment Checklist

- [ ] ✅ Application loads successfully
- [ ] ✅ User registration works
- [ ] ✅ User login works
- [ ] ✅ Project creation works
- [ ] ✅ Task management works
- [ ] ✅ Database operations work
- [ ] ✅ Email notifications work (if configured)
- [ ] ✅ Mobile responsive design
- [ ] ✅ Performance is acceptable
- [ ] ✅ Error tracking is working
- [ ] ✅ Analytics is tracking
- [ ] ✅ SSL certificate is active
- [ ] ✅ Custom domain works (if configured)

## 📚 Useful Commands

### Vercel CLI Commands
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from local
vercel

# Deploy to production
vercel --prod

# Check logs
vercel logs

# Pull environment variables
vercel env pull .env.local

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url
\`\`\`

### Database Commands
\`\`\`bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio

# Reset database (development only)
npx prisma migrate reset
\`\`\`

### Development Commands
\`\`\`bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Lint code
npm run lint
\`\`\`

## 🎯 Next Steps

Setelah deployment berhasil:

1. **Setup monitoring dan alerts**
2. **Configure backup strategy**
3. **Setup staging environment**
4. **Implement feature flags**
5. **Setup A/B testing**
6. **Optimize performance**
7. **Setup analytics tracking**
8. **Plan scaling strategy**

## 📞 Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

**🎉 Selamat! Aplikasi TaskFlow Anda sekarang sudah live di Vercel!**

Akses aplikasi di: `https://your-app-name.vercel.app`

# CleanBee - Community-Driven Waste Management Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)   [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue)](https://tailwindcss.com/) [![Web3Auth](https://img.shields.io/badge/Web3Auth-Latest-purple)](https://web3auth.io/)

CleanBee is a web3-enabled platform that gamifies community-driven waste management. Powered by Next.js and AI technology, CleanBee simplifies environmental cleanup and rewards participants.


## 🌟 Key Features

### For Community Members
- **Smart Waste Reporting** 📸: Upload waste images, receive AI-powered classification, and earn points.
- **Cleanup Management** 🗺️: Browse, claim, and verify cleanups, earning points for successful tasks.
- **Web3 Integration** 🌐: Secure login, transparent point tracking, and future NFT rewards.

### For Administrators
- **Dashboard Analytics** 📊: Track community engagement, cleanup progress, and environmental impact.

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+**, **Tailwind CSS**, **shadcn/ui components**, **Web3Auth**, **Next-Auth.js**

### Backend & Database
- **NeonDB (PostgreSQL)**, **Prisma ORM**
- **Gemini AI** (Waste Classification), **Mapbox API**, **Cloudinary** (Image Management)

### DevOps & Tooling
- **TypeScript**, **ESLint**, **Prettier**, **Husky** for Git hooks

## 📦 Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/cleanup.git
cd cleanup

```

2. **Install Dependencies**
```bash
npm install
# or
pnpm install
# or
yarn install
```

3. **Environment Setup**
Create a `.env.local` file:
```bash
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:password@neon.db.url:5432/cleanbee"

# Authentication
NEXT_PUBLIC_WEB3AUTH_CLIENT_ID=your_web3auth_client_id
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# APIs
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

4. **Database Setup**
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

5. **Start Development Server**
```bash
npm run dev
# or
pnpm dev
# or
yarn dev
```

## 🎯 Usage Guide

### Getting Started
1. Connect your wallet using Web3Auth
2. Complete your profile setup
3. Start exploring nearby waste reports

### Reporting Waste
1. Click "Report Waste" button
2. Upload waste image
3. Confirm location on Mapbox
4. Wait for Gemini AI verification
5. Receive points upon verification

### Cleaning Up
1. Browse reports on the interactive map
2. Select a cleanup task
3. Click "Accept Challenge"
4. Complete cleanup
5. Upload verification photo
6. Earn bonus points

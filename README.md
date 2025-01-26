# CleanBee 🐝 - Community-Driven Waste Management Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-blue)](https://tailwindcss.com/)
[![Web3Auth](https://img.shields.io/badge/Web3Auth-Latest-purple)](https://web3auth.io/)

CleanBee is a modern web3-enabled waste management platform that transforms community cleanup into an engaging, gamified experience. Powered by Next.js and AI technology, CleanBee makes environmental stewardship accessible and rewarding for everyone.

![CleanBee Banner](banner-placeholder.png)

## 🌟 Key Features

### For Community Members
- **Smart Waste Reporting** 📸
  - Upload waste images with geolocation
  - AI-powered waste classification using Gemini AI
  - Real-time verification system
  - Points awarded based on waste type and quantity

- **Interactive Cleanup Management** 🗺️
  - Browse nearby waste reports on an interactive Mapbox interface
  - Claim cleanup responsibilities
  - Upload before/after photos for verification
  - Earn bonus points for successful cleanups

- **Web3 Integration** 🌐
  - Secure authentication via Web3Auth
  - Transparent point tracking
  - Future NFT rewards system
  - Cross-platform wallet support

### For Administrators
- **Dashboard Analytics** 📊
  - Real-time community engagement metrics
  - Cleanup progress monitoring
  - Environmental impact reports
  - Waste hotspot identification

## 🛠️ Technology Stack

### Frontend
- **Next.js 14+**
  - App Router
  - Server Components
  - API Routes
- **UI/Styling**
  - Tailwind CSS
  - shadcn/ui components
  - Lucide Icons
- **Authentication**
  - Web3Auth
  - Next-Auth.js

### Backend & Database
- **Database**
  - NeonDB (PostgreSQL)
  - Prisma ORM
- **APIs**
  - Gemini AI API (Waste Classification)
  - Mapbox API (Geolocation)
  - Web3Auth API
  - Cloudinary (Image Management)

### DevOps & Tooling
- TypeScript
- ESLint
- Prettier
- Husky for Git hooks

## 📦 Installation

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/cleanbee.git
cd cleanbee
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

## 🚀 Roadmap

### Q2 2024
- [ ] NFT rewards system
- [ ] Advanced AI waste classification
- [ ] Community chat features

### Q3 2024
- [ ] Mobile responsive optimization
- [ ] DAO governance implementation
- [ ] Automated reward distribution

### Q4 2024
- [ ] Multi-chain support
- [ ] Carbon footprint calculator
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request





# PAYBURST (FlashWork) - Real-time Micro-Job Marketplace for Students

## 📋 Project Overview

PAYBURST is a comprehensive micro-job marketplace platform designed for students and freelancers. It features dynamic pricing, group collaboration, escrow protection, auction mode for urgent jobs, and a trust fund system for dispute resolution.

## 🏗️ Architecture

### Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: Vanilla JavaScript (ES6 modules)
- **Authentication**: JWT-based (ready for Clerk integration)
- **File Upload**: Multer
- **Password Hashing**: bcrypt

### Project Structure
```
flashwork/
├── backend/
│   ├── config/
│   │   ├── database.js          # Prisma client initialization
│   │   └── razorpay.js          # Payment config (simulated)
│   ├── controllers/
│   │   ├── authController.js    # Auth endpoints
│   │   ├── jobController.js     # Job CRUD, bidding, auction
│   │   ├── platformController.js # Trust fund
│   │   ├── poolController.js    # Worker pool
│   │   ├── scheduleController.js # Worker schedules
│   │   ├── userController.js    # User profile
│   │   ├── walletController.js  # Wallet operations
│   │   └── workerController.js  # Worker dashboard
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── roleMiddleware.js    # Role-based access
│   │   └── uploadMiddleware.js  # File upload handling
│   ├── prisma/
│   │   ├── schema.prisma        # Database schema
│   │   ├── final-seed.js        # Seed data (40 jobs)
│   │   └── migrations/          # Database migrations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── jobRoutes.js
│   │   ├── platformRoutes.js
│   │   ├── poolRoutes.js
│   │   ├── scheduleRoutes.js
│   │   ├── userRoutes.js
│   │   ├── walletRoutes.js
│   │   └── workerRoutes.js
│   ├── uploads/                 # Uploaded files
│   ├── server.js                # Express server
│   ├── package.json
│   └── .env                     # Environment variables
├── frontend/
│   ├── client/                  # Client-specific pages
│   │   ├── dashboard.html
│   │   ├── job-detail.html
│   │   ├── my-jobs.html
│   │   ├── post-job.html
│   │   └── wallet.html
│   ├── worker/                  # Worker-specific pages
│   │   ├── browse.html
│   │   ├── dashboard.html
│   │   ├── job-detail.html
│   │   ├── profile.html
│   │   ├── recommended.html
│   │   ├── schedule.html
│   │   └── wallet.html
│   ├── css/
│   │   ├── global.css           # Light mode, pastel colors
│   │   ├── landing.css          # Landing page styles
│   │   ├── worker-light.css     # Browse jobs light mode
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── client.css
│   │   ├── worker.css
│   │   ├── schedule.css
│   │   └── wallet.css
│   ├── js/
│   │   ├── api.js               # API wrapper with auto-logout
│   │   ├── auth.js              # Auth utilities
│   │   ├── config.js            # API endpoints
│   │   ├── utils.js             # Helper functions
│   │   ├── landing.js           # Landing page logic
│   │   ├── client/              # Client JS modules
│   │   ├── worker/              # Worker JS modules
│   │   └── components/          # Shared components
│   ├── index.html               # Landing page
│   ├── login.html
│   └── register.html
└── README.md
```

## 🗄️ Database Schema

### Core Models

#### User
```prisma
model User {
  id                  Int       @id @default(autoincrement())
  name                String
  email               String    @unique
  password_hash       String
  role                String    // "client", "worker", "both"
  wallet_balance      Float     @default(0)
  reputation          Float     @default(3.0)
  total_reviews       Int       @default(0)
  total_earnings      Float     @default(0)
  skills              Json?     // Array of skills
  education           String?
  is_student          Boolean   @default(false)
  daily_hour_limit    Int       @default(4)
  weekly_hour_limit   Int       @default(20)
  created_at          DateTime  @default(now())
}
```

#### Job
```prisma
model Job {
  id                   Int       @id @default(autoincrement())
  title                String
  description          String
  base_price           Float
  current_price        Float
  pricing_mode         String    // "rising", "declining", "fixed"
  deadline             DateTime
  work_mode            String    // "solo", "group"
  ai_allowed           Boolean
  status               String    @default("open") // "open", "assigned", "submitted", "completed"
  urgent_status        Boolean   @default(false)
  auction_mode         Boolean   @default(false)
  extension_count      Int       @default(0)
  max_extensions       Int       @default(3)
  estimated_hours      Int
  question_file_url    String?
  submission_file_url  String?
  rated                Boolean   @default(false)
  client_id            Int
  created_at           DateTime  @default(now())
  updated_at           DateTime  @updatedAt
}
```

#### AuctionBid
```prisma
model AuctionBid {
  id         Int      @id @default(autoincrement())
  job_id     Int
  worker_id  Int
  bid_amount Float
  message    String?
  status     String   @default("pending") // "pending", "accepted", "rejected"
  created_at DateTime @default(now())
  
  @@unique([job_id, worker_id])
}
```

#### Escrow
```prisma
model Escrow {
  id            Int      @id @default(autoincrement())
  job_id        Int      @unique
  locked_amount Float
  status        String   // "locked", "released", "refunded"
  locked        Boolean  @default(true)
  client_id     Int
  created_at    DateTime @default(now())
}
```

#### TrustFund
```prisma
model TrustFund {
  id        Int      @id @default(autoincrement())
  balance   Float    @default(0)
  createdAt DateTime @default(now())
}
```

#### WorkerSchedule
```prisma
model WorkerSchedule {
  id          Int    @id @default(autoincrement())
  worker_id   Int
  day_of_week Int    // 0-6 (Sunday-Saturday)
  start_time  String // "HH:MM"
  end_time    String // "HH:MM"
}
```

## 🔐 Authentication System

### Current Implementation (JWT)
- **Registration**: POST `/api/auth/register`
- **Login**: POST `/api/auth/login` → Returns JWT token
- **Profile**: GET `/api/auth/profile` (requires auth)

### Token Storage
- Frontend stores JWT in `localStorage.getItem('token')`
- Auto-logout on "User not found" or 401 errors

### Middleware
- `authMiddleware.js`: Verifies JWT, attaches `req.user`
- `roleMiddleware.js`: Checks user role (client/worker/both)

## 🎯 Core Features

### 1. Job Management

#### Job Creation (Client)
- **Endpoint**: POST `/api/jobs`
- **Fields**: title, description, base_price, deadline, work_mode, ai_allowed, urgent_status, auction_mode, estimated_hours
- **Validation**: `auction_mode` requires `urgent_status = true`
- **Escrow**: Automatically locks funds from client wallet

#### Job Browsing (Worker)
- **Endpoint**: GET `/api/jobs/open`
- **Filters**: work_mode, urgent_status, auction_mode, ai_allowed, min_price
- **Returns**: Open jobs with status "open"

#### Job Detail
- **Endpoint**: GET `/api/jobs/:id`
- **Access**: Client (owner), assigned worker, OR any worker if status = "open"

### 2. Auction Mode

#### Concept
- **Only for urgent jobs**: `urgent_status = true` AND `auction_mode = true`
- **Workers bid UP**: Bid amount must be ≥ current_price
- **Client selects winner**: Highest bid or best reputation

#### Bidding Flow
1. Worker places bid: POST `/api/jobs/:id/bid`
   - Body: `{ bidAmount, message }`
   - One bid per worker (can update)
2. Client views bids: GET `/api/jobs/:id/bids`
   - Sorted by bid_amount DESC, then reputation DESC
3. Client accepts bid: POST `/api/jobs/:id/select`
   - Body: `{ bid_id }`
   - Updates job price to bid amount
   - Deducts difference from client wallet
   - Updates escrow
   - Rejects other bids

### 3. Wallet System

#### Operations
- **Top-up**: POST `/api/wallet/topup` (simulated payment)
- **Withdraw**: POST `/api/wallet/withdraw`
- **Balance**: GET `/api/wallet/balance`
- **Transactions**: GET `/api/wallet/transactions`

#### Payment Flow
1. **Job Posted**: Client wallet → Escrow (locked)
2. **Job Completed**: Worker submits → Client approves
3. **Payout**: 
   - Platform fee: 1% → Trust Fund
   - Worker earnings: 99% → Worker wallet
   - Escrow released

### 4. Trust Fund

#### Purpose
- 1% of every approved job goes to Trust Fund
- Used for dispute resolution and platform insurance

#### Endpoints
- **Balance**: GET `/api/platform/trust-fund`

### 5. Group Collaboration

#### Group Jobs
- **work_mode**: "group"
- **Leader**: First worker to accept
- **Members**: Leader invites others by worker_id
- **Payout**: Split equally among all members (after platform fee)

#### Endpoints
- **Accept as group**: POST `/api/jobs/:id/accept`
  - Body: `{ mode: "group", member_ids: [2, 3, 4] }`

### 6. Reputation System

#### Rating
- **Endpoint**: POST `/api/jobs/:id/rate`
- **Body**: `{ rating: 1-5 }`
- **Calculation**: Weighted average of all ratings
- **Group jobs**: Rating applies to all members

#### Display
- Worker profile shows: `reputation` (out of 5) and `total_reviews`

### 7. Deadline Extensions

#### Rules
- Max 3 extensions per job
- Each extension: 10% payout reduction
- Worker requests: POST `/api/jobs/:id/extend`

### 8. Worker Schedules

#### Weekly Availability
- **Endpoint**: POST `/api/schedule`
- **Body**: `{ day: 0-6, startTime: "09:00", endTime: "17:00" }`
- **View**: GET `/api/schedule`
- **Delete**: DELETE `/api/schedule/:id`

### 9. Skill-Based Recommendations

#### Algorithm
- Matches worker skills with job title/description
- Calculates match percentage
- **Endpoint**: GET `/api/jobs/recommended`
- **Returns**: Jobs sorted by match score

## 🎨 UI/UX Design

### Color Scheme (Light Mode)

#### Global Palette
```css
--pastel-peach: #FDE8D8
--pastel-mint: #D8F5E8
--pastel-lavender: #E8D8F5
--pastel-sky: #D8EAF5
--pastel-cream: #FDF5D8
--bg-primary: #FFFFFF
--bg-secondary: #F8F9FA
--nav-bg: #000000
--text-primary: #1A1A1A
--text-secondary: #6B7280
--accent-orange: #FF6B35
--accent-pink: #FF6B9D
```

#### Landing Page Colors
```css
--page-bg: #EDE9F6 (lavender)
--btn-browse: #7C5CBF (purple)
--btn-post: #9B6FD4 (light purple)
--btn-dashboard: #E8A0C0 (pink)
--btn-jobs: #F0B8C8 (light pink)
```

### Pages

#### Landing Page (`/index.html`)
- Hero section with animated logo
- "PAYBURST" branding
- 4 CTA buttons
- How It Works section (3 cards)
- Platform Features section (6 cards)
- Footer

#### Browse Jobs (`/worker/browse.html`)
- Left sidebar: Filters (work mode, price, urgent, auction)
- Right: Job cards grid (3 columns)
- Pastel card backgrounds (rotate through 5 colors)
- Badges: Urgent (⚡), Auction (🔨), AI OK (🤖)
- Auction mode filter only shows when Urgent is checked

#### Job Detail
- Full job information
- Accept/Bid buttons based on auction mode
- For auction jobs: Bid panel with amount input and message

#### Dashboards
- Stats cards (earnings, jobs, etc.)
- Active jobs list
- Trust fund info card

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v13+)
- npm or yarn

### Backend Setup

1. **Install dependencies**
```bash
cd flashwork/backend
npm install
```

2. **Configure environment**
Create `.env` file:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/flashwork"
JWT_SECRET="your-secret-key-here"
PORT=5000
```

3. **Setup database**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed database (40 jobs, 3 workers, 2 clients)
node prisma/final-seed.js
```

4. **Start server**
```bash
node server.js
# Server runs on http://localhost:5000
```

### Frontend Setup

1. **Install live-server** (or any static server)
```bash
npm install -g live-server
```

2. **Start frontend**
```bash
cd flashwork/frontend
live-server --port=8080
# Frontend runs on http://localhost:8080
```

### Test Accounts

#### Clients
- Email: `rajesh@client.com` | Password: `password123`
- Email: `priya@client.com` | Password: `password123`

#### Workers
- Email: `amit@worker.com` | Password: `password123`
  - Skills: Data Entry, Excel, Writing, Proofreading
- Email: `sneha@worker.com` | Password: `password123`
  - Skills: Design, Canva, PowerPoint, Graphics (Student)
- Email: `vikram@worker.com` | Password: `password123`
  - Skills: Video Editing, Photography, Content Creation

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register    - Register new user
POST   /api/auth/login       - Login (returns JWT)
GET    /api/auth/profile     - Get user profile (auth required)
```

### Jobs
```
GET    /api/jobs             - Get client's jobs
POST   /api/jobs             - Create job (client only)
GET    /api/jobs/open        - Browse open jobs (worker only)
GET    /api/jobs/recommended - Get skill-matched jobs
GET    /api/jobs/:id         - Get job details
GET    /api/jobs/:id/bid-info - Get bid count and worker's bid
POST   /api/jobs/:id/accept  - Accept job (worker only)
POST   /api/jobs/:id/submit  - Submit work (worker only)
POST   /api/jobs/:id/approve - Approve work (client only)
POST   /api/jobs/:id/extend  - Request deadline extension
POST   /api/jobs/:id/rate    - Rate worker (client only)
```

### Auction
```
POST   /api/jobs/:id/bid     - Place/update bid
GET    /api/jobs/:id/bids    - Get all bids (client only)
POST   /api/jobs/:id/select  - Accept bid (client only)
```

### Wallet
```
GET    /api/wallet/balance       - Get wallet balance
POST   /api/wallet/topup         - Add funds
POST   /api/wallet/withdraw      - Withdraw funds
GET    /api/wallet/transactions  - Get transaction history
```

### Worker
```
GET    /api/workers/dashboard    - Worker dashboard stats
GET    /api/workers/daily-alert  - Check daily hour limit
```

### Schedule
```
GET    /api/schedule         - Get worker's schedule
POST   /api/schedule         - Add availability slot
DELETE /api/schedule/:id     - Remove slot
```

### Platform
```
GET    /api/platform/trust-fund  - Get trust fund balance
```

## 🐛 Known Issues & Pending Work

### Database Migration Issue
- **Problem**: AuctionBid schema update pending migration
- **Status**: PostgreSQL advisory lock preventing migration
- **Solution**: Restart PostgreSQL service, then run:
  ```bash
  npx prisma migrate dev --name update_auction_bid_model
  ```

### Incomplete Features
1. **Auction Mode UI** (Partially Complete)
   - ✅ Backend endpoints implemented
   - ✅ Job creation with auction validation
   - ✅ Bidding logic
   - ⚠️ Worker job detail bid panel (needs implementation)
   - ⚠️ Client bid selection UI (needs implementation)

2. **Browse Jobs Redesign** (Phase 1 Complete)
   - ✅ Phase 1: Light mode color scheme
   - ⚠️ Phase 2: Horizontal filters (pending)
   - ⚠️ Phase 3: Final polish (pending)

3. **Recommended Jobs Page**
   - ⚠️ Shows "Error loading jobs" - needs debugging

## 🔄 Recent Changes

### Latest Updates
1. **Light Mode Redesign**
   - Switched from dark to light mode
   - Added pastel card backgrounds
   - Updated global color palette
   - Created `worker-light.css`

2. **Landing Page**
   - Created PAYBURST landing page
   - Animated logo with float effect
   - 4 CTA buttons with exact colors
   - How It Works + Platform Features sections

3. **Auction Mode Backend**
   - Updated schema with bid_amount, message, status
   - Validation: auction requires urgent
   - Workers bid UP (not down)
   - Client accepts bid → updates price + escrow

4. **Filter Updates**
   - Removed max price filter
   - Auction mode only shows when Urgent is checked
   - Auto-logout on "User not found" error

5. **Authorization Fix**
   - Workers can now view open job details before applying
   - Fixed "Not authorized" error on job detail page

## 🧪 Testing Checklist

### Authentication
- [ ] Register new user
- [ ] Login with test accounts
- [ ] Auto-logout on invalid token
- [ ] Role-based access (client/worker pages)

### Job Lifecycle (Regular)
- [ ] Client posts job
- [ ] Worker browses jobs
- [ ] Worker accepts job
- [ ] Worker submits work
- [ ] Client approves work
- [ ] Worker receives payment
- [ ] Trust fund receives 1%

### Job Lifecycle (Auction)
- [ ] Client posts urgent + auction job
- [ ] Multiple workers place bids
- [ ] Workers can update bids
- [ ] Client views bids sorted by amount
- [ ] Client accepts highest bid
- [ ] Price updates to bid amount
- [ ] Other bids rejected

### Wallet
- [ ] Top-up wallet
- [ ] Check balance
- [ ] View transactions
- [ ] Withdraw funds

### Group Jobs
- [ ] Worker accepts as group
- [ ] Adds member IDs
- [ ] Payout splits equally
- [ ] All members get rated

### Reputation
- [ ] Client rates worker after approval
- [ ] Reputation updates (weighted average)
- [ ] Rating shows on worker profile

### Filters
- [ ] Work mode filter (solo/group)
- [ ] Urgent filter
- [ ] Auction filter (only when urgent checked)
- [ ] AI allowed filter
- [ ] Min price filter

### UI/UX
- [ ] Landing page loads correctly
- [ ] Pastel card backgrounds rotate
- [ ] Buttons have hover effects
- [ ] Responsive design (mobile/tablet/desktop)
- [ ] Toast notifications work

## 📝 Code Quality Notes

### Best Practices Followed
- ✅ Modular architecture (controllers, routes, middleware)
- ✅ Prisma ORM for type-safe database access
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Error handling with try-catch
- ✅ ES6 modules on frontend
- ✅ Responsive CSS design

### Areas for Improvement
- ⚠️ Add input sanitization
- ⚠️ Implement rate limiting
- ⚠️ Add request logging
- ⚠️ Write unit tests
- ⚠️ Add API documentation (Swagger)
- ⚠️ Implement WebSocket for real-time updates
- ⚠️ Add email notifications
- ⚠️ Implement file upload validation

## 🔮 Future Enhancements

### Planned Features
1. **Real Payment Integration**
   - Replace simulated payments with Razorpay/Stripe
   
2. **Clerk Authentication**
   - Replace JWT with Clerk
   - Social login (Google, GitHub)
   
3. **Real-time Notifications**
   - WebSocket for live updates
   - Push notifications
   
4. **Advanced Search**
   - Full-text search
   - Location-based filtering
   
5. **Dispute Resolution**
   - Use Trust Fund for disputes
   - Admin panel for resolution
   
6. **Analytics Dashboard**
   - Earnings charts
   - Job completion rates
   - Platform statistics

## 📞 Support

For issues or questions:
1. Check this README
2. Review code comments
3. Check browser console for errors
4. Check backend logs

## 📄 License

This project was built for a hackathon. All rights reserved.

---

**Built with ❤️ for students and freelancers**

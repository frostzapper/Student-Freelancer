# FlashWork - Complete Jobs List

## Summary
- **Total Jobs**: 40
- **Online Jobs**: 32
- **Offline Jobs**: 8
- **Urgent Jobs**: 20
- **Auction Mode Jobs**: 10

---

## ONLINE JOBS (32 jobs)

### Short Hours (2-5h) - Student Friendly

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 183 | Data Entry - Excel Spreadsheet | 3h | ₹500 | ⚡ | |
| 184 | PowerPoint Presentation Design | 3h | ₹550 | | |
| 185 | English Proofreading Service | 3h | ₹600 | ⚡ | |
| 186 | Assignment Writing - History Essay | 4h | ₹650 | | |
| 187 | Social Media Graphics - Canva | 4h | ₹700 | | |

### Medium Hours (6-10h)

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 188 | Website Content Writing | 8h | ₹1,250 | | |
| 189 | Excel Dashboard Creation | 7h | ₹1,350 | ⚡ | |
| 190 | Video Editing - YouTube Channel | 10h | ₹1,450 | | |
| 191 | Logo Design Package | 9h | ₹1,550 | | |
| 202 | Photography + Online Editing | 10h | ₹2,100 | ⚡ | |
| 203 | JavaScript Bug Fixing | 6h | ₹1,200 | | |
| 204 | Python Data Analysis Script | 8h | ₹1,500 | | |
| 205 | Logo Design for Startup | 10h | ₹1,800 | | |
| 207 | Blog Writing - Technology Articles | 10h | ₹1,400 | | |
| 208 | Video Editing - YouTube Content | 12h | ₹1,600 | ⚡ | |
| 209 | Social Media Marketing Strategy | 8h | ₹1,300 | | |
| 210 | Excel Dashboard Creation | 7h | ₹1,100 | | |
| 211 | Product Photography - E-commerce | 12h | ₹2,200 | | |
| 212 | English to Hindi Translation | 6h | ₹900 | | |

### Long Hours (12-20h)

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 192 | Mobile App Testing - Full QA | 15h | ₹3,200 | | |
| 193 | Social Media Management - 2 Weeks | 20h | ₹3,800 | | |
| 206 | UI/UX Design - Mobile App | 15h | ₹2,500 | ⚡ | |

### URGENT AUCTION MODE JOBS (10 jobs)

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 213 | URGENT: Website Bug Fix Needed NOW | 3h | ₹2,000 | ⚡ | 🎯 |
| 214 | URGENT: Presentation Design - Meeting Tomorrow | 5h | ₹1,500 | ⚡ | 🎯 |
| 215 | URGENT: Data Entry - Deadline Today | 4h | ₹1,200 | ⚡ | 🎯 |
| 216 | URGENT: Video Editing - Event Tomorrow | 6h | ₹2,500 | ⚡ | 🎯 |
| 217 | URGENT: Logo Design - Launch This Week | 8h | ₹3,000 | ⚡ | 🎯 |
| 218 | URGENT: Content Writing - Blog Posts Needed | 10h | ₹1,800 | ⚡ | 🎯 |
| 219 | URGENT: Social Media Graphics - Campaign Starting | 6h | ₹1,600 | ⚡ | 🎯 |
| 220 | URGENT: Excel Dashboard - Board Meeting | 7h | ₹2,200 | ⚡ | 🎯 |
| 221 | URGENT: Product Photography - Listing Today | 5h | ₹2,800 | ⚡ | 🎯 |
| 222 | URGENT: Translation - Contract Signing Tomorrow | 6h | ₹1,400 | ⚡ | 🎯 |

---

## OFFLINE JOBS (8 jobs)

### Short Hours (2-5h)

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 194 | Flyer Distribution - College Campus | 3h | ₹520 | ⚡ | |
| 195 | Grocery Shopping & Delivery | 3h | ₹580 | | |
| 196 | Pet Walking Service | 4h | ₹620 | | |
| 197 | Mystery Shopping - Restaurant | 3h | ₹820 | ⚡ | |

### Medium Hours (6-10h)

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 198 | Home Cleaning Service | 7h | ₹1,080 | | |
| 199 | Product Photography - Store | 6h | ₹1,180 | | |
| 200 | Furniture Assembly - IKEA | 8h | ₹1,380 | ⚡ | |

### Group Job

| ID  | Title | Hours | Price | Urgent | Auction |
|-----|-------|-------|-------|--------|---------|
| 201 | Event Setup & Management | 12h | ₹2,600 | | |

---

## Login Credentials

### Clients
- **Client 1**: rajesh@client.com / password123 (Wallet: ₹50,000)
- **Client 2**: priya@client.com / password123 (Wallet: ₹30,000)

### Workers
- **Worker 1**: amit@worker.com / password123
  - Skills: Data Entry, Excel, Writing, Proofreading
  - Education: B.Com Graduate
  
- **Worker 2**: sneha@worker.com / password123
  - Skills: Design, Canva, PowerPoint, Graphics
  - Education: BBA Student (Student limits: 4h/day, 20h/week)
  
- **Worker 3**: vikram@worker.com / password123
  - Skills: Video Editing, Photography, Content Creation
  - Education: Mass Communication Graduate

---

## Filter Testing Guide

### Test Online Filter
- Select "Online" in Work Location filter
- Should show 32 jobs
- All jobs should have 🌐 Online badge

### Test Offline Filter
- Select "Offline" in Work Location filter
- Should show 8 jobs
- All jobs should have 📍 Offline badge

### Test Work Mode Filter
- Select "Solo" - Should show 39 jobs
- Select "Group" - Should show 1 job (Event Setup & Management)

### Test Urgent Filter
- Check "Urgent Only"
- Should show 20 urgent jobs with ⚡ badge

### Test Auction Mode Filter
- Check "Urgent Only" first (auction requires urgent)
- Check "Auction Mode"
- Should show 10 auction jobs with 🎯 badge

### Test Combined Filters
- Online + Urgent: 18 jobs
- Offline + Urgent: 2 jobs
- Online + Auction: 10 jobs
- Solo + Online: 31 jobs
- Solo + Offline: 7 jobs
- Group + Offline: 1 job

---

## Database Reset Command
```bash
cd flashwork/backend
node prisma/final-seed.js
```

## Server Commands
```bash
# Backend (Port 5000)
cd flashwork/backend
npm start

# Frontend (Port 8080)
cd flashwork/frontend
python -m http.server 8080
```

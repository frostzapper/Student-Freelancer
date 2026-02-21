# PAYBURST - Demo Guide for Jury Presentation

## Quick Start (30 seconds)

### Option 1: One-Click Startup (Recommended)
1. Double-click `START_PAYBURST.bat`
2. Wait 5 seconds
3. Browser opens automatically to http://localhost:8080
4. Done!

### Option 2: Manual Startup
```bash
# Terminal 1 - Backend
cd flashwork/backend
npm start

# Terminal 2 - Frontend
cd flashwork/frontend
python -m http.server 8080
```

Then open: http://localhost:8080

---

## Demo Flow (5-7 minutes)

### 1. Landing Page (30 seconds)
- Show PAYBURST branding
- Explain: "Real-time micro-job marketplace for students"
- Highlight features: Auction mode, Group collaboration, Escrow protection

### 2. Worker Journey (2 minutes)

**Login as Worker:**
- Email: `worker1@test.com`
- Password: `password123`

**Show Features:**
1. **Browse Jobs** - Filter by urgent, auction mode, solo/group
2. **Recommended Jobs** - AI-matched based on skills
3. **Job Details** - View job, place bid (if auction), or apply
4. **Dashboard** - Active jobs, earnings, reputation score
5. **Wallet** - Balance, transactions, top-up/withdraw

### 3. Client Journey (2 minutes)

**Logout → Login as Client:**
- Email: `client1@test.com`
- Password: `password123`

**Show Features:**
1. **Post Job** - Create job with urgent + auction mode
2. **My Jobs** - View posted jobs
3. **Job Bids** - See worker bids, select winner
4. **Approve Work** - Release escrow payment
5. **Wallet** - Track spending

### 4. Unique Features (1-2 minutes)

**Highlight:**
- ⚡ **Auction Mode**: Workers bid UP on urgent jobs
- 👥 **Group Collaboration**: Auto-form teams, split earnings
- 🛡️ **Escrow System**: Funds locked until approval
- 💰 **Trust Fund**: 1% platform fee builds dispute insurance
- ⭐ **Reputation**: Ratings follow workers across jobs
- ⏰ **Deadline Extensions**: Transparent penalty system

---

## Test Accounts

### Workers
| Email | Password | Skills |
|-------|----------|--------|
| worker1@test.com | password123 | Web Dev, Design |
| worker2@test.com | password123 | Data Entry, Excel |
| worker3@test.com | password123 | Content Writing |

### Clients
| Email | Password |
|-------|----------|
| client1@test.com | password123 |
| client2@test.com | password123 |

---

## Common Demo Scenarios

### Scenario A: Urgent Auction Job
1. Login as Client → Post urgent auction job (₹2000)
2. Logout → Login as Worker1 → Browse → Bid ₹2500
3. Logout → Login as Worker2 → Browse → Bid ₹2800
4. Logout → Login as Client → View bids → Select Worker2
5. Show escrow locked at ₹2800

### Scenario B: Group Job
1. Login as Client → Post group job (3 workers needed)
2. Workers apply → Client selects team
3. Show earnings split automatically

### Scenario C: Complete Job Flow
1. Worker applies → Client accepts
2. Worker submits work
3. Client approves → Escrow releases
4. Show wallet balances updated
5. Show reputation score increased

---

## Troubleshooting

### If servers don't start:
```bash
# Check if ports are in use
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Kill processes if needed
taskkill /PID <process_id> /F
```

### If database connection fails:
```bash
# Restart PostgreSQL
net stop postgresql-x64-18
net start postgresql-x64-18
```

### If frontend shows errors:
- Clear browser localStorage: F12 → Application → Local Storage → Clear
- Hard refresh: Ctrl + Shift + R

---

## Key Talking Points

1. **Problem**: Students need flexible, quick-paying gigs
2. **Solution**: Real-time marketplace with instant matching
3. **Innovation**: Auction mode for urgent jobs (workers bid UP, not down)
4. **Trust**: Escrow + Trust Fund + Reputation system
5. **Collaboration**: Auto-group formation for complex tasks
6. **Tech Stack**: Node.js, PostgreSQL, Prisma, Vanilla JS

---

## Stopping the Demo

- If using `START_PAYBURST.bat`: Press any key in the batch window
- Manual: Close both terminal windows
- Or: `Ctrl + C` in each terminal

---

## Pro Tips

- Keep browser DevTools closed during demo (looks cleaner)
- Pre-login to accounts before demo starts
- Have 2-3 browser windows ready (different accounts)
- Use incognito windows for multiple simultaneous logins
- Zoom browser to 110% for better visibility
- Prepare backup: Record a video demo in case of technical issues

---

## Questions Jury Might Ask

**Q: Why auction mode?**
A: Urgent jobs need fast completion. Workers bid UP based on their availability and expertise, ensuring quality.

**Q: How do you prevent fraud?**
A: Escrow holds funds, reputation system tracks history, trust fund covers disputes.

**Q: What's your revenue model?**
A: 1% platform fee on all completed jobs.

**Q: How is this different from Fiverr/Upwork?**
A: Real-time matching, student-focused, group collaboration, auction mode for urgent tasks.

**Q: Scalability?**
A: PostgreSQL handles millions of records, stateless API design, can add Redis caching, deploy on AWS/Railway.

---

Good luck with your presentation! 🚀

# Quick Fix for Render Deployment Error

## The Problem
```
Error: Environment variable not found: DIRECT_URL
```

## The Solution (2 minutes)

### Go to Render Dashboard:
1. Open https://dashboard.render.com
2. Click your backend service
3. Click **Environment** tab
4. Click **Add Environment Variable**

### Add This Variable:

**Key:**
```
DIRECT_URL
```

**Value:**
```
postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Also Verify These Variables Exist:

**DATABASE_URL:**
```
postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**JWT_SECRET:**
```
your-secret-key-here-change-in-production
```

### Save and Wait
- Click **Save Changes**
- Render will auto-redeploy (takes 2-3 minutes)
- Check logs for success message

## Done! ✅

Your deployment should now succeed.

---

**Note:** The difference between the two URLs:
- DATABASE_URL has `-pooler` (for app queries)
- DIRECT_URL doesn't have `-pooler` (for migrations)

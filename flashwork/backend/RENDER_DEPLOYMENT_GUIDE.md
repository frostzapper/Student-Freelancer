# Render Deployment Guide for FlashWork Backend

## Error: Environment variable not found: DIRECT_URL

This error occurs because Render doesn't have the `DIRECT_URL` environment variable configured.

## Solution: Configure Environment Variables in Render

### Step 1: Get Your Neon Database URLs

From your Neon dashboard (https://console.neon.tech):

1. Go to your project
2. Click on "Connection Details"
3. You'll see two connection strings:
   - **Pooled connection** (for DATABASE_URL) - contains `-pooler` in the hostname
   - **Direct connection** (for DIRECT_URL) - without `-pooler`

### Step 2: Add Environment Variables to Render

1. Go to your Render dashboard (https://dashboard.render.com)
2. Select your backend service
3. Click on **Environment** in the left sidebar
4. Add the following environment variables:

#### Required Variables:

| Key | Value | Example |
|-----|-------|---------|
| `DATABASE_URL` | Your Neon pooled connection URL | `postgresql://user:pass@host-pooler.region.aws.neon.tech/db?sslmode=require` |
| `DIRECT_URL` | Your Neon direct connection URL | `postgresql://user:pass@host.region.aws.neon.tech/db?sslmode=require` |
| `JWT_SECRET` | Your JWT secret key | `your-secure-random-string-here` |
| `PORT` | Port number (optional, Render sets this) | `5000` |

#### Your Specific URLs (Based on .env):

**DATABASE_URL** (Pooled):
```
postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**DIRECT_URL** (Direct):
```
postgresql://neondb_owner:npg_okNiC3cWFlx7@ep-raspy-cherry-a1q5clhl.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**JWT_SECRET**:
```
your-secret-key-here-change-in-production
```

### Step 3: Save and Redeploy

1. Click **Save Changes** in Render
2. Render will automatically redeploy your service
3. Monitor the deployment logs

## Why Do We Need Both URLs?

- **DATABASE_URL (Pooled)**: Used for regular application queries. Connection pooling improves performance.
- **DIRECT_URL (Direct)**: Used by Prisma migrations and schema operations. These require direct database access.

## Verification

After deployment, check the logs for:
```
✔ Generated Prisma Client
Prisma schema loaded from prisma/schema.prisma
Database migrations applied successfully
Server running on port 5000
```

## Troubleshooting

### If deployment still fails:

1. **Check environment variables are saved**: Go to Environment tab and verify all variables are present
2. **Check database connection**: Ensure your Neon database is active and accessible
3. **Check Neon IP allowlist**: Make sure Render's IPs are allowed (Neon usually allows all by default)
4. **Review logs**: Check Render logs for specific error messages

### Common Issues:

- **"Connection refused"**: Database URL might be incorrect
- **"SSL required"**: Make sure `?sslmode=require` is in your connection string
- **"Authentication failed"**: Check username and password in connection string

## Security Notes

⚠️ **Important**: Never commit your actual database credentials to Git!

- Use Render's environment variables for production
- Keep `.env` file in `.gitignore`
- Rotate your JWT_SECRET for production
- Consider using Render's secret files for sensitive data

## Next Steps After Successful Deployment

1. Test your API endpoints
2. Run database seeds if needed: `npm run seed` (if you have a seed script)
3. Monitor application logs for any runtime errors
4. Set up health checks in Render
5. Configure custom domain (optional)

## Support

If you continue to have issues:
- Check Render documentation: https://render.com/docs
- Check Neon documentation: https://neon.tech/docs
- Review Prisma documentation: https://www.prisma.io/docs

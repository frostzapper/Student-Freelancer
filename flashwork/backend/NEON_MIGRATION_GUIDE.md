# Neon Database Migration Guide

This guide will help you migrate your FlashWork application from local PostgreSQL to Neon serverless PostgreSQL.

## Why Neon?

- **Serverless**: Auto-scaling, pay-per-use pricing
- **Branching**: Create database branches for development/testing
- **Fast**: Built on PostgreSQL with optimizations
- **Free Tier**: Generous free tier for development

## Step 1: Create a Neon Account

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Sign up with GitHub, Google, or email
3. Create a new project

## Step 2: Get Your Connection String

1. In your Neon dashboard, click on your project
2. Go to "Connection Details"
3. Copy the connection string (it looks like this):
   ```
   postgresql://[user]:[password]@[hostname]/[database]?sslmode=require
   ```

## Step 3: Update Your .env File

1. Open `flashwork/backend/.env`
2. Replace the `DATABASE_URL` with your Neon connection string:
   ```env
   DATABASE_URL="postgresql://[user]:[password]@[hostname]/[database]?sslmode=require"
   ```

3. (Optional) Add a direct URL for migrations:
   ```env
   DIRECT_URL="postgresql://[user]:[password]@[hostname]/[database]?sslmode=require"
   ```

## Step 4: Run Migrations

```bash
cd flashwork/backend
npx prisma migrate deploy
```

This will apply all existing migrations to your Neon database.

## Step 5: Generate Prisma Client

```bash
npx prisma generate
```

## Step 6: (Optional) Seed Your Database

If you want to populate your database with initial data:

```bash
node prisma/final-seed.js
```

## Step 7: Test Your Connection

Start your server and test:

```bash
npm start
```

## Troubleshooting

### Connection Timeout

If you get connection timeouts, make sure:
- Your Neon project is active (not suspended)
- The connection string includes `?sslmode=require`
- Your firewall allows outbound connections

### Migration Errors

If migrations fail:
1. Check your connection string is correct
2. Ensure your Neon database is empty or has compatible schema
3. Try resetting: `npx prisma migrate reset` (WARNING: This deletes all data)

### SSL Certificate Issues

Neon requires SSL. Make sure your connection string includes:
```
?sslmode=require
```

## Neon-Specific Features

### Database Branching

Create a branch for development:
```bash
# In Neon console, create a branch
# Update .env with branch connection string
DATABASE_URL="postgresql://[user]:[password]@[branch-hostname]/[database]?sslmode=require"
```

### Connection Pooling

Neon provides built-in connection pooling. For serverless environments, use the pooled connection string from your Neon dashboard.

### Monitoring

Monitor your database usage in the Neon dashboard:
- Query performance
- Storage usage
- Connection count

## Migration Checklist

- [ ] Created Neon account
- [ ] Created new project in Neon
- [ ] Copied connection string
- [ ] Updated .env file
- [ ] Ran `npx prisma migrate deploy`
- [ ] Ran `npx prisma generate`
- [ ] Tested application connection
- [ ] (Optional) Seeded database
- [ ] Verified all features work

## Rollback Plan

If you need to rollback to local PostgreSQL:

1. Update .env back to local connection:
   ```env
   DATABASE_URL="postgresql://postgres:Snowfall@40839@localhost:5432/flashwork"
   ```

2. Restart your application

## Support

- Neon Documentation: https://neon.tech/docs
- Prisma with Neon: https://www.prisma.io/docs/guides/database/neon
- FlashWork Issues: Create an issue in your repository

## Next Steps

After successful migration:
1. Update your deployment configuration with Neon connection string
2. Set up database backups (Neon provides automatic backups)
3. Configure monitoring and alerts
4. Consider using Neon branches for staging/development environments

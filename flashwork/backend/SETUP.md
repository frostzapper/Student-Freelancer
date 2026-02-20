# Database Setup

## Create PostgreSQL Database

```bash
psql -U postgres
CREATE DATABASE flashwork;
\q
```

## Run Prisma Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Start Server

```bash
npm install
npm start
```

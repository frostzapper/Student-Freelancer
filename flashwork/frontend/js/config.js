// API Configuration
export const API_BASE_URL = 'fetch("https://student-freelancer-1.onrender.com/api")';

export const ENDPOINTS = {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    PROFILE: '/auth/profile',
    
    // Jobs
    JOBS: '/jobs',
    JOBS_OPEN: '/jobs/open',
    JOBS_RECOMMENDED: '/jobs/recommended',
    
    // Worker
    WORKER_DASHBOARD: '/workers/dashboard',
    WORKER_DAILY_ALERT: '/workers/daily-alert',
    
    // Wallet
    WALLET_BALANCE: '/wallet/balance',
    WALLET_TOPUP: '/wallet/topup',
    WALLET_WITHDRAW: '/wallet/withdraw',
    WALLET_TRANSACTIONS: '/wallet/transactions',
    
    // Schedule
    SCHEDULE: '/schedule',
    
    // Pool
    POOL_ENTER: '/pool/enter',
    POOL_EXIT: '/pool/exit',
    POOL_ACTIVE: '/pool/active',
    
    // Platform
    TRUST_FUND: '/platform/trust-fund'
};

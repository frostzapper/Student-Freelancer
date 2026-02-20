// Client Dashboard
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { formatCurrency, formatDateTime } from '../utils.js';

requireAuth();
requireRole(['client', 'both']);

let allJobs = [];
let currentFilter = 'all';

async function loadDashboard() {
    try {
        // Load wallet balance
        const walletData = await apiRequest(ENDPOINTS.WALLET_BALANCE);
        document.getElementById('wallet-balance').textContent = formatCurrency(walletData.balance);
        
        // Load trust fund balance
        await loadTrustFund();
        
        // Load jobs
        await loadJobs();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

async function loadTrustFund() {
    try {
        const trustFundData = await apiRequest(ENDPOINTS.TRUST_FUND);
        document.getElementById('trust-fund-balance').textContent = formatCurrency(trustFundData.balance || 0);
    } catch (error) {
        console.error('Error loading trust fund:', error);
        document.getElementById('trust-fund-balance').textContent = '₹0';
    }
}

async function loadJobs() {
    const loadingState = document.getElementById('loading-jobs');
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    
    try {
        loadingState.style.display = 'block';
        jobsGrid.style.display = 'none';
        emptyState.style.display = 'none';
        
        const jobs = await apiRequest(ENDPOINTS.JOBS);
        allJobs = Array.isArray(jobs) ? jobs : [];
        
        // Update stats
        updateStats(allJobs);
        
        // Render jobs
        renderJobs(allJobs);
        
        loadingState.style.display = 'none';
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        loadingState.innerHTML = '<p style="color: var(--accent-pink);">Error loading jobs</p>';
    }
}

function updateStats(jobs) {
    const totalJobs = jobs.length;
    const activeJobs = jobs.filter(j => j.status === 'open' || j.status === 'assigned').length;
    const completedJobs = jobs.filter(j => j.status === 'completed').length;
    const totalSpent = jobs
        .filter(j => j.status === 'completed')
        .reduce((sum, j) => sum + (j.current_price || j.base_price), 0);
    
    document.getElementById('total-jobs').textContent = totalJobs;
    document.getElementById('active-jobs').textContent = activeJobs;
    document.getElementById('completed-jobs').textContent = completedJobs;
    document.getElementById('total-spent').textContent = formatCurrency(totalSpent);
}

function renderJobs(jobs) {
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    
    // Filter jobs based on current filter
    let filteredJobs = jobs;
    if (currentFilter !== 'all') {
        filteredJobs = jobs.filter(j => j.status === currentFilter);
    }
    
    if (filteredJobs.length === 0) {
        jobsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    jobsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    jobsGrid.innerHTML = '';
    
    filteredJobs.forEach(job => {
        const card = createClientJobCard(job);
        jobsGrid.appendChild(card);
    });
}

function createClientJobCard(job) {
    const card = document.createElement('div');
    card.className = 'client-job-card';
    card.onclick = () => window.location.href = `/client/job-detail.html?id=${job.id}`;
    
    // Status badge
    const statusBadge = document.createElement('div');
    statusBadge.className = `job-status-badge status-${job.status}`;
    statusBadge.textContent = job.status.toUpperCase();
    
    // Escrow indicator
    const escrowIndicator = document.createElement('div');
    escrowIndicator.className = 'escrow-indicator';
    if (job.escrow && job.escrow.locked) {
        escrowIndicator.innerHTML = '🔒 <span>Escrow Locked</span>';
        escrowIndicator.classList.add('locked');
    } else if (job.escrow && !job.escrow.locked) {
        escrowIndicator.innerHTML = '🔓 <span>Payment Released</span>';
        escrowIndicator.classList.add('released');
    }
    
    // Job header
    const header = document.createElement('div');
    header.className = 'client-job-header';
    header.appendChild(statusBadge);
    if (job.escrow) {
        header.appendChild(escrowIndicator);
    }
    
    // Job title
    const title = document.createElement('h3');
    title.className = 'client-job-title';
    title.textContent = job.title;
    
    // Job meta
    const meta = document.createElement('div');
    meta.className = 'client-job-meta';
    
    const metaItems = [];
    
    // Work mode
    metaItems.push(`<span class="meta-item">${job.work_mode === 'solo' ? '👤 Solo' : '👥 Group'}</span>`);
    
    // Urgent
    if (job.urgent_status) {
        metaItems.push(`<span class="meta-item urgent">⚡ Urgent</span>`);
    }
    
    // AI allowed
    if (job.ai_allowed) {
        metaItems.push(`<span class="meta-item">🤖 AI OK</span>`);
    }
    
    // Deadline
    metaItems.push(`<span class="meta-item">📅 ${formatDateTime(job.deadline)}</span>`);
    
    meta.innerHTML = metaItems.join('');
    
    // Job footer
    const footer = document.createElement('div');
    footer.className = 'client-job-footer';
    
    const price = document.createElement('div');
    price.className = 'client-job-price';
    price.textContent = formatCurrency(job.current_price || job.base_price);
    
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn btn-primary btn-small';
    viewBtn.textContent = 'View Details →';
    viewBtn.onclick = (e) => {
        e.stopPropagation();
        window.location.href = `/client/job-detail.html?id=${job.id}`;
    };
    
    footer.appendChild(price);
    footer.appendChild(viewBtn);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(footer);
    
    return card;
}

// Filter tabs
document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        
        // Update filter and render
        currentFilter = e.target.dataset.status;
        renderJobs(allJobs);
    });
});

loadDashboard();

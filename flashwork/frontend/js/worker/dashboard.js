// Worker Dashboard
import { requireAuth, requireRole, getUser } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { formatCurrency, formatDateTime, showToast } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

const currentUser = getUser();
let currentExtensionJobId = null;
let currentExtensionJobPrice = 0;

async function loadDashboard() {
    try {
        const data = await apiRequest(ENDPOINTS.WORKER_DASHBOARD);
        
        document.getElementById('total-earnings').textContent = formatCurrency(data.total_earnings);
        document.getElementById('completed-jobs').textContent = data.total_completed_jobs;
        document.getElementById('active-jobs').textContent = data.total_active_jobs;
        document.getElementById('pending-jobs').textContent = data.total_pending_jobs;
        
        // Load trust fund balance
        await loadTrustFund();
        
        // Load active jobs
        await loadActiveJobs();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showToast(error.message || 'Failed to load dashboard', 'error');
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

async function loadActiveJobs() {
    const loadingState = document.getElementById('loading-active-jobs');
    const jobsList = document.getElementById('active-jobs-list');
    const emptyState = document.getElementById('empty-active-jobs');
    const submittedSection = document.getElementById('submitted-jobs-section');
    const submittedList = document.getElementById('submitted-jobs-list');
    const completedSection = document.getElementById('completed-jobs-section');
    const completedList = document.getElementById('completed-jobs-list');
    
    try {
        loadingState.style.display = 'block';
        jobsList.style.display = 'none';
        emptyState.style.display = 'none';
        
        console.log('Fetching worker jobs from:', ENDPOINTS.WORKER_JOBS);
        console.log('Current user:', currentUser);
        
        // Fetch worker's assigned jobs
        const allJobs = await apiRequest(ENDPOINTS.WORKER_JOBS);
        console.log('Worker jobs received:', allJobs);
        console.log('Total jobs:', allJobs.length);
        
        // Filter jobs by status
        const activeJobs = allJobs.filter(job => job.status === 'assigned');
        const submittedJobs = allJobs.filter(job => job.status === 'submitted');
        const completedJobs = allJobs.filter(job => job.status === 'completed');
        
        console.log('Active jobs (assigned status):', activeJobs.length);
        console.log('Submitted jobs:', submittedJobs.length);
        console.log('Completed jobs:', completedJobs.length);
        
        loadingState.style.display = 'none';
        
        // Display active jobs
        if (activeJobs.length === 0) {
            console.log('No active jobs found, showing empty state');
            emptyState.style.display = 'block';
        } else {
            console.log('Displaying', activeJobs.length, 'active jobs');
            jobsList.style.display = 'block';
            jobsList.innerHTML = '';
            activeJobs.forEach(job => {
                console.log('Creating card for job:', job.id, job.title);
                const card = createActiveJobCard(job);
                jobsList.appendChild(card);
            });
        }
        
        // Display submitted jobs
        if (submittedJobs.length > 0) {
            submittedSection.style.display = 'block';
            submittedList.innerHTML = '';
            submittedJobs.forEach(job => {
                const card = createSubmittedJobCard(job);
                submittedList.appendChild(card);
            });
        } else {
            submittedSection.style.display = 'none';
        }
        
        // Display completed jobs
        if (completedJobs.length > 0) {
            completedSection.style.display = 'block';
            completedList.innerHTML = '';
            completedJobs.forEach(job => {
                const card = createCompletedJobCard(job);
                completedList.appendChild(card);
            });
        } else {
            completedSection.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Error loading active jobs:', error);
        console.error('Error details:', error.message);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
    }
}

function createSubmittedJobCard(job) {
    const card = document.createElement('div');
    card.className = 'active-job-card';
    card.style.border = '2px solid #f59e0b';
    card.style.background = 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)';
    
    card.innerHTML = `
        <div class="active-job-header">
            <div>
                <h3 class="active-job-title">${job.title}</h3>
                <div class="job-badges">
                    <span class="job-badge" style="background: #f59e0b;">⏳ Awaiting Review</span>
                    ${job.work_mode === 'group' ? '<span class="job-badge">👥 Group</span>' : '<span class="job-badge">👤 Solo</span>'}
                </div>
            </div>
            <div class="active-job-price">${formatCurrency(job.current_price)}</div>
        </div>
        
        <div class="active-job-meta">
            <div class="meta-item">
                <span class="meta-label">Submitted:</span>
                <span class="meta-value">${formatDateTime(job.updated_at || job.created_at)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="meta-value" style="color: #f59e0b;">Pending Client Approval</span>
            </div>
        </div>
        
        <div class="active-job-actions">
            <button class="btn btn-secondary btn-small" onclick="window.location.href='/worker/job-detail.html?id=${job.id}'">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

function createCompletedJobCard(job) {
    const card = document.createElement('div');
    card.className = 'active-job-card';
    card.style.border = '2px solid #22c55e';
    card.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
    
    card.innerHTML = `
        <div class="active-job-header">
            <div>
                <h3 class="active-job-title">${job.title}</h3>
                <div class="job-badges">
                    <span class="job-badge" style="background: #22c55e;">✅ Completed</span>
                    ${job.work_mode === 'group' ? '<span class="job-badge">👥 Group</span>' : '<span class="job-badge">👤 Solo</span>'}
                </div>
            </div>
            <div class="active-job-price">${formatCurrency(job.current_price)}</div>
        </div>
        
        <div class="active-job-meta">
            <div class="meta-item">
                <span class="meta-label">Completed:</span>
                <span class="meta-value">${formatDateTime(job.updated_at || job.created_at)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="meta-value" style="color: #22c55e;">Payment Released</span>
            </div>
        </div>
        
        <div class="active-job-actions">
            <button class="btn btn-secondary btn-small" onclick="window.location.href='/worker/job-detail.html?id=${job.id}'">
                View Details
            </button>
        </div>
    `;
    
    return card;
}

function createActiveJobCard(job) {
    const card = document.createElement('div');
    card.className = 'active-job-card';
    
    // Calculate extensions remaining
    const extensionsRemaining = job.max_extensions - job.extension_count;
    
    card.innerHTML = `
        <div class="active-job-header">
            <div>
                <h3 class="active-job-title">${job.title}</h3>
                <div class="job-badges">
                    ${job.urgent_status ? '<span class="job-badge badge-urgent">⚡ Urgent</span>' : ''}
                    ${job.work_mode === 'group' ? '<span class="job-badge">👥 Group</span>' : '<span class="job-badge">👤 Solo</span>'}
                </div>
            </div>
            <div class="active-job-price">${formatCurrency(job.current_price)}</div>
        </div>
        
        <div class="active-job-meta">
            <div class="meta-item">
                <span class="meta-label">Deadline:</span>
                <span class="meta-value">${formatDateTime(job.deadline)}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Extensions Used:</span>
                <span class="meta-value">${job.extension_count} / ${job.max_extensions}</span>
            </div>
            <div class="meta-item">
                <span class="meta-label">Status:</span>
                <span class="meta-value status-${job.status}">${job.status}</span>
            </div>
        </div>
        
        <div class="active-job-actions">
            <button class="btn btn-secondary btn-small" onclick="window.location.href='/worker/job-detail.html?id=${job.id}'">
                View Details
            </button>
            ${extensionsRemaining > 0 ? `
                <button class="btn btn-warning btn-small" data-job-id="${job.id}" data-price="${job.current_price}" data-remaining="${extensionsRemaining}">
                    ⏰ Request Extension (${extensionsRemaining} left)
                </button>
            ` : `
                <button class="btn btn-secondary btn-small" disabled>
                    No Extensions Left
                </button>
            `}
        </div>
    `;
    
    // Add extension button handler
    const extensionBtn = card.querySelector('[data-job-id]');
    if (extensionBtn) {
        extensionBtn.addEventListener('click', () => {
            openExtensionModal(
                parseInt(extensionBtn.dataset.jobId),
                parseFloat(extensionBtn.dataset.price),
                parseInt(extensionBtn.dataset.remaining)
            );
        });
    }
    
    return card;
}

function openExtensionModal(jobId, currentPrice, extensionsRemaining) {
    currentExtensionJobId = jobId;
    currentExtensionJobPrice = currentPrice;
    
    const newPrice = currentPrice * 0.9; // 10% reduction
    
    document.getElementById('current-payout').textContent = formatCurrency(currentPrice);
    document.getElementById('new-payout').textContent = formatCurrency(newPrice);
    document.getElementById('extensions-remaining').textContent = extensionsRemaining;
    
    document.getElementById('extension-modal').style.display = 'flex';
}

function closeExtensionModal() {
    currentExtensionJobId = null;
    currentExtensionJobPrice = 0;
    document.getElementById('extension-modal').style.display = 'none';
}

async function confirmExtension() {
    if (!currentExtensionJobId) return;
    
    try {
        document.getElementById('confirm-extension').disabled = true;
        document.getElementById('confirm-extension').textContent = 'Processing...';
        
        await apiRequest(`${ENDPOINTS.JOBS}/${currentExtensionJobId}/extend`, {
            method: 'POST'
        });
        
        showToast('Deadline extension granted! Payout reduced by 10%.', 'success');
        
        closeExtensionModal();
        
        // Reload dashboard
        setTimeout(() => {
            loadDashboard();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to request extension', 'error');
    } finally {
        document.getElementById('confirm-extension').disabled = false;
        document.getElementById('confirm-extension').textContent = 'Confirm Extension';
    }
}

// Modal controls
document.getElementById('close-extension-modal').addEventListener('click', closeExtensionModal);
document.getElementById('cancel-extension').addEventListener('click', closeExtensionModal);
document.getElementById('confirm-extension').addEventListener('click', confirmExtension);

// Close modal on outside click
document.getElementById('extension-modal').addEventListener('click', (e) => {
    if (e.target.id === 'extension-modal') {
        closeExtensionModal();
    }
});

loadDashboard();

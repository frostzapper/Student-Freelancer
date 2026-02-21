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
    
    try {
        loadingState.style.display = 'block';
        jobsList.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Fetch all jobs and filter for active ones assigned to this worker
        const allJobs = await apiRequest(ENDPOINTS.JOBS);
        
        // Filter for jobs where this worker is assigned and status is 'assigned'
        const activeJobs = allJobs.filter(job => 
            job.status === 'assigned' && 
            job.workerEntity && 
            (job.workerEntity.leader_id === currentUser.id || 
             job.workerEntity.groupMembers?.some(m => m.worker_id === currentUser.id))
        );
        
        loadingState.style.display = 'none';
        
        if (activeJobs.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        jobsList.style.display = 'block';
        jobsList.innerHTML = '';
        
        activeJobs.forEach(job => {
            const card = createActiveJobCard(job);
            jobsList.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading active jobs:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'block';
        // Don't show error message, just show empty state
    }
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

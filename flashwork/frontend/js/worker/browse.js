// Browse Jobs Page - Worker
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { showToast } from '../utils.js';
import { formatCurrency, formatDateTime } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

let allJobs = [];
let currentBidJobId = null;

// Show/hide auction mode filter based on urgent selection
const urgentCheckbox = document.getElementById('filter-urgent');
const auctionFilterOption = document.getElementById('auction-filter-option');
const auctionCheckbox = document.getElementById('filter-auction');

urgentCheckbox.addEventListener('change', () => {
    if (urgentCheckbox.checked) {
        auctionFilterOption.style.display = 'block';
    } else {
        auctionFilterOption.style.display = 'none';
        auctionCheckbox.checked = false;
    }
});

async function loadJobs() {
    const loadingState = document.getElementById('loading-state');
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    const jobsCount = document.getElementById('jobs-count');
    
    try {
        loadingState.style.display = 'block';
        jobsGrid.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Build query params
        const params = new URLSearchParams();
        
        const workMode = document.querySelector('input[name="work-mode"]:checked')?.value;
        if (workMode) params.append('work_mode', workMode);
        
        const urgent = document.getElementById('filter-urgent').checked;
        if (urgent) params.append('urgent_status', 'true');
        
        const aiAllowed = document.getElementById('filter-ai').checked;
        if (aiAllowed) params.append('ai_allowed', 'true');
        
        const auctionMode = document.getElementById('filter-auction').checked;
        if (auctionMode) params.append('auction_mode', 'true');
        
        const minPrice = document.getElementById('min-price').value;
        if (minPrice) params.append('min_price', minPrice);
        
        const query = params.toString() ? `?${params.toString()}` : '';
        const data = await apiRequest(`${ENDPOINTS.JOBS_OPEN}${query}`);
        
        allJobs = Array.isArray(data) ? data : [];
        
        loadingState.style.display = 'none';
        
        if (allJobs.length === 0) {
            emptyState.style.display = 'block';
            jobsCount.textContent = '0 jobs found';
            return;
        }
        
        renderJobs(allJobs);
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        loadingState.innerHTML = `<p style="color: var(--accent-pink);">Error: ${error.message}</p>`;
        jobsCount.textContent = 'Error';
    }
}

function renderJobs(jobs) {
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    const jobsCount = document.getElementById('jobs-count');
    
    // Apply search filter
    const searchQuery = document.getElementById('search-input').value.toLowerCase();
    let filteredJobs = jobs;
    
    if (searchQuery) {
        filteredJobs = jobs.filter(job => 
            job.title.toLowerCase().includes(searchQuery) ||
            job.description?.toLowerCase().includes(searchQuery)
        );
    }
    
    jobsGrid.innerHTML = '';
    
    if (filteredJobs.length === 0) {
        jobsGrid.style.display = 'none';
        emptyState.style.display = 'block';
        jobsCount.textContent = '0 jobs found';
        return;
    }
    
    jobsGrid.style.display = 'grid';
    emptyState.style.display = 'none';
    jobsCount.textContent = `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`;
    
    filteredJobs.forEach(job => {
        const card = createWorkerJobCard(job);
        jobsGrid.appendChild(card);
    });
}

function createWorkerJobCard(job) {
    const card = document.createElement('div');
    card.className = 'worker-job-card';
    
    // Job Header
    const header = document.createElement('div');
    header.className = 'worker-job-header';
    
    const badges = document.createElement('div');
    badges.className = 'job-badges';
    
    // Work mode badge
    const modeBadge = document.createElement('span');
    modeBadge.className = 'job-badge';
    modeBadge.textContent = job.work_mode === 'solo' ? '👤 Solo' : '👥 Group';
    badges.appendChild(modeBadge);
    
    // Urgent badge
    if (job.urgent_status) {
        const urgentBadge = document.createElement('span');
        urgentBadge.className = 'job-badge badge-urgent';
        urgentBadge.textContent = '⚡ Urgent';
        badges.appendChild(urgentBadge);
    }
    
    // Auction badge
    if (job.auction_mode) {
        const auctionBadge = document.createElement('span');
        auctionBadge.className = 'job-badge badge-auction';
        auctionBadge.textContent = '🎯 Auction';
        badges.appendChild(auctionBadge);
    }
    
    // AI badge
    if (job.ai_allowed) {
        const aiBadge = document.createElement('span');
        aiBadge.className = 'job-badge';
        aiBadge.textContent = '🤖 AI OK';
        badges.appendChild(aiBadge);
    }
    
    header.appendChild(badges);
    
    // Job Title
    const title = document.createElement('h3');
    title.className = 'worker-job-title';
    title.textContent = job.title;
    
    // Job Description
    const description = document.createElement('p');
    description.className = 'worker-job-description';
    description.textContent = job.description?.substring(0, 120) + (job.description?.length > 120 ? '...' : '');
    
    // Job Meta
    const meta = document.createElement('div');
    meta.className = 'worker-job-meta';
    meta.innerHTML = `
        <span>📅 ${formatDateTime(job.deadline)}</span>
        <span>⏱️ ${job.estimated_hours || 'N/A'} hours</span>
    `;
    
    // Job Footer
    const footer = document.createElement('div');
    footer.className = 'worker-job-footer';
    
    const price = document.createElement('div');
    price.className = 'worker-job-price';
    price.textContent = formatCurrency(job.current_price || job.base_price);
    
    const actions = document.createElement('div');
    actions.className = 'worker-job-actions';
    
    if (job.auction_mode) {
        // Bid button for auction jobs
        const bidBtn = document.createElement('button');
        bidBtn.className = 'btn btn-primary';
        bidBtn.textContent = '🎯 Place Bid';
        bidBtn.onclick = () => openBidModal(job);
        actions.appendChild(bidBtn);
    } else {
        // View details button
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-secondary btn-small';
        detailsBtn.textContent = 'View Details';
        detailsBtn.onclick = () => window.location.href = `/worker/job-detail.html?id=${job.id}`;
        actions.appendChild(detailsBtn);
        
        // Accept button for regular jobs
        const acceptBtn = document.createElement('button');
        acceptBtn.className = 'btn btn-primary';
        acceptBtn.textContent = '✓ Accept';
        acceptBtn.onclick = (e) => {
            e.stopPropagation();
            acceptJob(job.id);
        };
        actions.appendChild(acceptBtn);
    }
    
    footer.appendChild(price);
    footer.appendChild(actions);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(footer);
    
    return card;
}

async function acceptJob(jobId) {
    if (!confirm('Are you sure you want to accept this job?')) {
        return;
    }
    
    try {
        await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/accept`, {
            method: 'POST',
            body: JSON.stringify({ mode: 'solo' })
        });
        
        showToast('Job accepted successfully!', 'success');
        
        // Reload jobs
        setTimeout(() => {
            loadJobs();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to accept job', 'error');
    }
}

function openBidModal(job) {
    currentBidJobId = job.id;
    document.getElementById('bid-job-title').textContent = `Job: ${job.title}`;
    document.getElementById('bid-pitch').value = '';
    document.getElementById('bid-confidence').value = '8';
    document.getElementById('bid-modal').style.display = 'flex';
}

function closeBidModal() {
    currentBidJobId = null;
    document.getElementById('bid-modal').style.display = 'none';
}

async function submitBid() {
    const pitch = document.getElementById('bid-pitch').value.trim();
    const confidence = parseInt(document.getElementById('bid-confidence').value);
    
    if (!pitch) {
        showToast('Please enter your pitch', 'error');
        return;
    }
    
    if (confidence < 1 || confidence > 10) {
        showToast('Confidence must be between 1 and 10', 'error');
        return;
    }
    
    try {
        await apiRequest(`${ENDPOINTS.JOBS}/${currentBidJobId}/bid`, {
            method: 'POST',
            body: JSON.stringify({ pitch, confidence })
        });
        
        showToast('Bid submitted successfully!', 'success');
        closeBidModal();
        
        // Reload jobs
        setTimeout(() => {
            loadJobs();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to submit bid', 'error');
    }
}

// Price slider
const priceSlider = document.getElementById('price-slider');
const priceDisplay = document.getElementById('price-display');
const minPriceInput = document.getElementById('min-price');

priceSlider.addEventListener('input', (e) => {
    priceDisplay.textContent = e.target.value;
    minPriceInput.value = e.target.value;
});

minPriceInput.addEventListener('input', (e) => {
    priceSlider.value = e.target.value;
    priceDisplay.textContent = e.target.value;
});

// Apply filters button
document.getElementById('apply-filters').addEventListener('click', loadJobs);

// Search
document.getElementById('search-btn').addEventListener('click', () => renderJobs(allJobs));
document.getElementById('search-input').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') renderJobs(allJobs);
});

// Reset filters
document.getElementById('reset-filters').addEventListener('click', () => {
    document.getElementById('mode-all').checked = true;
    document.getElementById('filter-urgent').checked = false;
    document.getElementById('filter-ai').checked = false;
    document.getElementById('filter-auction').checked = false;
    document.getElementById('min-price').value = '0';
    document.getElementById('price-slider').value = '0';
    priceDisplay.textContent = '0';
    document.getElementById('search-input').value = '';
    auctionFilterOption.style.display = 'none';
    loadJobs();
});

// Bid modal controls
document.getElementById('close-modal').addEventListener('click', closeBidModal);
document.getElementById('cancel-bid').addEventListener('click', closeBidModal);
document.getElementById('submit-bid').addEventListener('click', submitBid);

// Close modal on outside click
document.getElementById('bid-modal').addEventListener('click', (e) => {
    if (e.target.id === 'bid-modal') {
        closeBidModal();
    }
});

loadJobs();

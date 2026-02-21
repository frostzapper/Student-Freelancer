// Job Detail Page
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS, API_BASE_URL } from '../config.js';
import { showToast } from '../utils.js';
import { formatCurrency, formatDateTime } from '../utils.js';

requireAuth();
requireRole(['client', 'both']);

const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get('id');

if (!jobId) {
    showToast('Job ID not provided', 'error');
    setTimeout(() => window.location.href = '/client/my-jobs.html', 2000);
}

async function loadJobDetails() {
    const loadingState = document.getElementById('loading-state');
    const contentState = document.getElementById('job-detail-content');
    
    try {
        const job = await apiRequest(`${ENDPOINTS.JOBS}/${jobId}`);
        
        loadingState.style.display = 'none';
        contentState.style.display = 'block';
        
        renderJobDetails(job);
        
        // Load bids if auction mode
        if (job.auction_mode && job.status === 'open') {
            await loadBids();
        }
        
    } catch (error) {
        console.error('Error loading job:', error);
        showToast(error.message || 'Failed to load job details', 'error');
        setTimeout(() => window.location.href = '/client/my-jobs.html', 2000);
    }
}

function renderJobDetails(job) {
    // Header
    document.getElementById('job-title').textContent = job.title;
    document.getElementById('job-id').textContent = job.id;
    document.getElementById('job-price').textContent = formatCurrency(job.current_price);
    
    // Status badge
    const statusBadge = document.getElementById('job-status');
    statusBadge.textContent = job.status.toUpperCase();
    statusBadge.className = `status-badge status-${job.status}`;
    
    // Description
    document.getElementById('job-description').textContent = job.description;
    
    // Job Info
    document.getElementById('job-category').textContent = job.category || 'N/A';
    document.getElementById('job-work-mode').textContent = job.work_mode === 'solo' ? '👤 Solo' : '👥 Group';
    document.getElementById('job-deadline').textContent = formatDateTime(job.deadline);
    document.getElementById('job-hours').textContent = `${job.estimated_hours} hours`;
    document.getElementById('job-ai').textContent = job.ai_allowed ? '✓ Yes' : '✗ No';
    document.getElementById('job-urgent').textContent = job.urgent_status ? '⚡ Yes' : 'No';
    document.getElementById('job-extensions').textContent = `${job.extension_count} / ${job.max_extensions}`;
    
    // Question file
    if (job.question_file_url) {
        document.getElementById('question-file-card').style.display = 'block';
        document.getElementById('question-file-link').href = `${API_BASE_URL}${job.question_file_url}`;
    }
    
    // Submission file
    if (job.submission_file_url) {
        document.getElementById('submission-file-card').style.display = 'block';
        document.getElementById('submission-file-link').href = `${API_BASE_URL}${job.submission_file_url}`;
        
        // Show approve button only if status is submitted
        if (job.status === 'submitted') {
            document.getElementById('approval-actions').style.display = 'block';
            setupApproveButton(job);
        } else {
            document.getElementById('approval-actions').style.display = 'none';
        }
    }
    
    // Escrow status
    if (job.escrow) {
        const escrowBadge = document.getElementById('escrow-badge');
        const escrowAmount = document.getElementById('escrow-amount');
        
        if (job.escrow.locked) {
            escrowBadge.innerHTML = '🔒 <strong>Locked</strong>';
            escrowBadge.className = 'escrow-badge locked';
        } else {
            escrowBadge.innerHTML = '🔓 <strong>Released</strong>';
            escrowBadge.className = 'escrow-badge released';
        }
        
        escrowAmount.textContent = formatCurrency(job.escrow.locked_amount);
    }
    
    // Worker info
    if (job.workerEntity) {
        document.getElementById('worker-card').style.display = 'block';
        const workerInfo = document.getElementById('worker-info');
        
        if (job.workerEntity.type === 'group' && job.workerEntity.groupMembers) {
            workerInfo.innerHTML = `
                <p><strong>Type:</strong> Group (${job.workerEntity.groupMembers.length} members)</p>
                <p><strong>Status:</strong> ${job.workerEntity.status}</p>
            `;
        } else {
            workerInfo.innerHTML = `
                <p><strong>Type:</strong> Solo</p>
                <p><strong>Status:</strong> ${job.workerEntity.status}</p>
            `;
        }
    }
    
    // Show payout if completed
    if (job.status === 'completed' && job.escrow && !job.escrow.locked) {
        showPayoutBreakdown(job);
    }
}

function setupApproveButton(job) {
    const approveBtn = document.getElementById('approve-btn');
    
    approveBtn.addEventListener('click', async () => {
        if (!confirm('Are you sure you want to approve this work and release payment?')) {
            return;
        }
        
        approveBtn.disabled = true;
        approveBtn.textContent = 'Processing...';
        
        try {
            const result = await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/approve`, {
                method: 'POST'
            });
            
            showToast('Work approved! Payment released to worker.', 'success');
            
            // Reload page to show updated status
            setTimeout(() => {
                window.location.reload();
            }, 1500);
            
        } catch (error) {
            showToast(error.message || 'Failed to approve work', 'error');
            approveBtn.disabled = false;
            approveBtn.textContent = '✓ Approve Work & Release Payment';
        }
    });
}

function showPayoutBreakdown(job) {
    const payoutCard = document.getElementById('payout-card');
    payoutCard.style.display = 'block';
    
    const platformCut = job.current_price * 0.01;
    const workerAmount = job.current_price - platformCut;
    
    document.getElementById('worker-payout').textContent = formatCurrency(workerAmount);
    document.getElementById('platform-fee').textContent = formatCurrency(platformCut);
    document.getElementById('total-payout').textContent = formatCurrency(job.current_price);
    
    // Add trust fund note
    const platformFeeElement = document.getElementById('platform-fee').parentElement;
    if (!platformFeeElement.querySelector('.trust-fund-note')) {
        const trustFundNote = document.createElement('div');
        trustFundNote.className = 'trust-fund-note';
        trustFundNote.innerHTML = `<small>🛡️ ${formatCurrency(platformCut)} added to Trust Fund</small>`;
        platformFeeElement.appendChild(trustFundNote);
    }
    
    // Show rating section if not rated
    if (!job.rated) {
        document.getElementById('rating-section').style.display = 'block';
        
        // Show group note if it's a group job
        if (job.work_mode === 'group') {
            document.getElementById('group-rating-note').style.display = 'block';
        }
        
        setupRatingSelector(job);
    } else {
        document.getElementById('already-rated').style.display = 'block';
    }
}

let selectedRating = 0;

function setupRatingSelector(job) {
    const stars = document.querySelectorAll('.rating-star');
    const submitBtn = document.getElementById('submit-rating');
    
    stars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRating = parseInt(star.dataset.rating);
            updateStarDisplay(selectedRating);
            submitBtn.disabled = false;
        });
        
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStarDisplay(rating);
        });
    });
    
    document.getElementById('rating-selector').addEventListener('mouseleave', () => {
        updateStarDisplay(selectedRating);
    });
    
    submitBtn.addEventListener('click', async () => {
        await submitRating(job.id);
    });
}

function updateStarDisplay(rating) {
    const stars = document.querySelectorAll('.rating-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.textContent = '★';
            star.classList.add('selected');
        } else {
            star.textContent = '☆';
            star.classList.remove('selected');
        }
    });
}

async function submitRating(jobId) {
    if (selectedRating === 0) {
        showToast('Please select a rating', 'error');
        return;
    }
    
    try {
        document.getElementById('submit-rating').disabled = true;
        document.getElementById('submit-rating').textContent = 'Submitting...';
        
        await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/rate`, {
            method: 'POST',
            body: JSON.stringify({ rating: selectedRating })
        });
        
        showToast('Rating submitted successfully!', 'success');
        
        // Hide rating section and show already rated message
        document.getElementById('rating-section').style.display = 'none';
        document.getElementById('already-rated').style.display = 'block';
        
    } catch (error) {
        showToast(error.message || 'Failed to submit rating', 'error');
        document.getElementById('submit-rating').disabled = false;
        document.getElementById('submit-rating').textContent = 'Submit Rating';
    }
}

async function loadBids() {
    try {
        const bids = await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/bids`);
        
        if (bids.length === 0) {
            return;
        }
        
        document.getElementById('bids-card').style.display = 'block';
        const bidsList = document.getElementById('bids-list');
        
        bidsList.innerHTML = '';
        
        bids.forEach((bid, index) => {
            const bidCard = document.createElement('div');
            bidCard.className = 'bid-card';
            bidCard.innerHTML = `
                <div class="bid-header">
                    <div>
                        <strong>${bid.worker.name}</strong>
                        <div class="bid-meta">
                            <span>Confidence: ${bid.confidence}/10</span>
                            <span>Reputation: ${bid.worker.reputation?.toFixed(1) || 'N/A'}</span>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-small select-worker-btn" data-worker-id="${bid.worker_id}">
                        Select Winner
                    </button>
                </div>
                <p class="bid-pitch">${bid.pitch}</p>
            `;
            
            bidsList.appendChild(bidCard);
        });
        
        // Add event listeners to select buttons
        document.querySelectorAll('.select-worker-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const workerId = parseInt(e.target.dataset.workerId);
                await selectWorker(workerId);
            });
        });
        
    } catch (error) {
        console.error('Error loading bids:', error);
    }
}

async function selectWorker(workerId) {
    if (!confirm('Are you sure you want to select this worker?')) {
        return;
    }
    
    try {
        await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/select`, {
            method: 'POST',
            body: JSON.stringify({ worker_id: workerId })
        });
        
        showToast('Worker selected successfully!', 'success');
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to select worker', 'error');
    }
}

loadJobDetails();

// Recommended Jobs Page
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { showToast } from '../utils.js';
import { formatCurrency, formatDateTime } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

async function loadRecommendedJobs() {
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    const noSkillsMessage = document.getElementById('no-skills-message');
    
    try {
        jobsGrid.innerHTML = '<div class="loading-state"><p>Loading recommended jobs...</p></div>';
        
        const response = await apiRequest(ENDPOINTS.JOBS_RECOMMENDED);
        
        console.log('Recommended jobs response:', response);
        
        jobsGrid.innerHTML = '';
        
        // Check if response indicates no skills
        if (response && response.message === 'NO_SKILLS') {
            noSkillsMessage.style.display = 'block';
            emptyState.style.display = 'block';
            return;
        }
        
        // Handle array response
        const jobs = Array.isArray(response) ? response : (response.jobs || []);
        
        if (!jobs || jobs.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        jobs.forEach(job => {
            const card = createRecommendedJobCard(job);
            jobsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading jobs:', error);
        console.error('Error details:', error.message, error.stack);
        jobsGrid.innerHTML = '';
        emptyState.style.display = 'block';
        // Don't show error toast, just show empty state
    }
}

function createRecommendedJobCard(job) {
    const card = document.createElement('div');
    card.className = 'worker-job-card recommended-job-card';
    
    // Job Header with match badge
    const header = document.createElement('div');
    header.className = 'worker-job-header';
    
    const badges = document.createElement('div');
    badges.className = 'job-badges';
    
    // Match badge (highlighted)
    if (job.matchPercent > 0) {
        const matchBadge = document.createElement('span');
        matchBadge.className = 'job-badge match-badge';
        matchBadge.textContent = `${job.matchPercent}% Match`;
        badges.appendChild(matchBadge);
    }
    
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
    
    // View details button
    const detailsBtn = document.createElement('button');
    detailsBtn.className = 'btn btn-secondary btn-small';
    detailsBtn.textContent = 'View Details';
    detailsBtn.onclick = () => window.location.href = `/worker/job-detail.html?id=${job.id}`;
    actions.appendChild(detailsBtn);
    
    // Accept button
    const acceptBtn = document.createElement('button');
    acceptBtn.className = 'btn btn-primary';
    acceptBtn.textContent = '✓ Accept Job';
    acceptBtn.onclick = (e) => {
        e.stopPropagation();
        acceptJob(job.id);
    };
    actions.appendChild(acceptBtn);
    
    footer.appendChild(price);
    footer.appendChild(actions);
    
    // Assemble card
    card.appendChild(header);
    card.appendChild(title);
    card.appendChild(description);
    card.appendChild(meta);
    card.appendChild(footer);
    
    // Make card clickable
    card.style.cursor = 'pointer';
    card.onclick = () => window.location.href = `/worker/job-detail.html?id=${job.id}`;
    
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
            loadRecommendedJobs();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to accept job', 'error');
    }
}

loadRecommendedJobs();

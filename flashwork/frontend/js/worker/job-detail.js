// Worker Job Detail Page
import { requireAuth, requireRole, getUser } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS, API_BASE_URL } from '../config.js';
import { showToast } from '../utils.js';
import { formatCurrency, formatDateTime } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

const urlParams = new URLSearchParams(window.location.search);
const jobId = urlParams.get('id');
const currentUser = getUser();

if (!jobId) {
    showToast('Job ID not provided', 'error');
    setTimeout(() => window.location.href = '/worker/browse.html', 2000);
}

let currentJob = null;

async function loadJobDetails() {
    const loadingState = document.getElementById('loading-state');
    const contentState = document.getElementById('job-detail-content');
    
    try {
        const job = await apiRequest(`${ENDPOINTS.JOBS}/${jobId}`);
        currentJob = job;
        
        loadingState.style.display = 'none';
        contentState.style.display = 'block';
        
        renderJobDetails(job);
        
    } catch (error) {
        console.error('Error loading job:', error);
        showToast(error.message || 'Failed to load job details', 'error');
        setTimeout(() => window.location.href = '/worker/browse.html', 2000);
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
    document.getElementById('job-work-mode').textContent = job.work_mode === 'solo' ? '👤 Solo' : '👥 Group';
    document.getElementById('job-deadline').textContent = formatDateTime(job.deadline);
    document.getElementById('job-hours').textContent = `${job.estimated_hours} hours`;
    document.getElementById('job-ai').textContent = job.ai_allowed ? '✓ Yes' : '✗ No';
    document.getElementById('job-urgent').textContent = job.urgent_status ? '⚡ Yes' : 'No';
    document.getElementById('job-pricing').textContent = job.pricing_mode || 'Fixed';
    
    // Question file
    if (job.question_file_url) {
        document.getElementById('question-file-card').style.display = 'block';
        document.getElementById('question-file-link').href = `${API_BASE_URL}${job.question_file_url}`;
    }
    
    // Status info
    const statusInfo = document.getElementById('status-info');
    statusInfo.innerHTML = `
        <p><strong>Status:</strong> ${job.status}</p>
        <p><strong>Created:</strong> ${formatDateTime(job.created_at)}</p>
    `;
    
    // Show accept button only if job is open
    if (job.status === 'open') {
        document.getElementById('accept-card').style.display = 'block';
        
        // Setup accept button
        if (job.work_mode === 'group') {
            // Show group options
            document.getElementById('group-card').style.display = 'block';
            document.getElementById('group-actions').style.display = 'block';
            setupGroupButtons(job);
        } else {
            // Regular solo job
            setupAcceptButton(job);
        }
    }
    
    // If job is assigned and has worker entity, show group members
    if (job.workerEntity && job.work_mode === 'group') {
        showGroupMembers(job);
    }
}

function setupAcceptButton(job) {
    const acceptBtn = document.getElementById('accept-job-btn');
    acceptBtn.onclick = () => acceptJob('solo');
}

function setupGroupButtons(job) {
    // Accept solo
    document.getElementById('accept-solo-btn').onclick = () => acceptJob('solo');
    
    // Accept as group
    document.getElementById('accept-group-btn').onclick = () => {
        document.getElementById('group-modal').style.display = 'flex';
    };
}

async function acceptJob(mode, memberIds = []) {
    if (!confirm(`Are you sure you want to accept this job as ${mode}?`)) {
        return;
    }
    
    try {
        const body = { mode };
        if (mode === 'group' && memberIds.length > 0) {
            body.member_ids = memberIds;
        }
        
        await apiRequest(`${ENDPOINTS.JOBS}/${jobId}/accept`, {
            method: 'POST',
            body: JSON.stringify(body)
        });
        
        showToast('Job accepted successfully!', 'success');
        
        setTimeout(() => {
            window.location.reload();
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to accept job', 'error');
    }
}

function showGroupMembers(job) {
    document.getElementById('group-card').style.display = 'block';
    document.getElementById('group-members-display').style.display = 'block';
    
    const membersList = document.getElementById('members-list');
    const memberCount = document.getElementById('member-count');
    
    const members = job.workerEntity.groupMembers || [];
    memberCount.textContent = `${members.length} member${members.length !== 1 ? 's' : ''}`;
    
    membersList.innerHTML = '';
    
    members.forEach(member => {
        const memberCard = createMemberCard(member, job.workerEntity.leader_id);
        membersList.appendChild(memberCard);
    });
    
    // Show payout split
    showPayoutSplit(job, members.length);
}

function createMemberCard(member, leaderId) {
    const card = document.createElement('div');
    card.className = 'member-card';
    
    const isLeader = member.worker_id === leaderId;
    
    // Get initials
    const name = member.worker?.name || 'Unknown';
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    card.innerHTML = `
        <div class="member-avatar">${initials}</div>
        <div class="member-info">
            <div class="member-name">
                ${name}
                ${isLeader ? '<span class="leader-badge">👑 Leader</span>' : ''}
            </div>
            <div class="member-id">ID: ${member.worker_id}</div>
        </div>
    `;
    
    return card;
}

function showPayoutSplit(job, memberCount) {
    const totalPrice = job.current_price;
    const platformFee = totalPrice * 0.01;
    const workerAmount = totalPrice - platformFee;
    const perMember = workerAmount / memberCount;
    
    document.getElementById('split-total').textContent = formatCurrency(totalPrice);
    document.getElementById('split-fee').textContent = formatCurrency(platformFee);
    document.getElementById('split-per-member').textContent = formatCurrency(perMember);
}

// Group modal controls
document.getElementById('close-group-modal').addEventListener('click', () => {
    document.getElementById('group-modal').style.display = 'none';
});

document.getElementById('cancel-group').addEventListener('click', () => {
    document.getElementById('group-modal').style.display = 'none';
});

document.getElementById('submit-group').addEventListener('click', () => {
    const memberIdsInput = document.getElementById('member-ids').value.trim();
    
    if (!memberIdsInput) {
        showToast('Please enter member IDs', 'error');
        return;
    }
    
    const memberIds = memberIdsInput.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    
    if (memberIds.length === 0) {
        showToast('Please enter valid member IDs', 'error');
        return;
    }
    
    document.getElementById('group-modal').style.display = 'none';
    acceptJob('group', memberIds);
});

// Close modal on outside click
document.getElementById('group-modal').addEventListener('click', (e) => {
    if (e.target.id === 'group-modal') {
        document.getElementById('group-modal').style.display = 'none';
    }
});

loadJobDetails();

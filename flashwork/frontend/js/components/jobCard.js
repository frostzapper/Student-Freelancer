// Job Card Component - Modern Colorful Design
import { formatCurrency } from '../utils.js';

const cardColors = ['yellow', 'green', 'purple', 'blue', 'pink'];
let colorIndex = 0;

export async function createJobCard(job, options = {}) {
    const card = document.createElement('div');
    card.className = `job-card color-${cardColors[colorIndex % cardColors.length]}`;
    colorIndex++;
    
    // Job Meta
    const meta = document.createElement('div');
    meta.className = 'job-meta';
    meta.innerHTML = `
        <span class="job-date">Today</span>
        <span class="job-edit-icon">✏️</span>
    `;
    
    // Job Client
    const client = document.createElement('div');
    client.className = 'job-client';
    client.textContent = job.client_name || 'Client';
    
    // Job Title
    const title = document.createElement('h3');
    title.className = 'job-title';
    title.textContent = job.title;
    
    // Job Badges
    const badges = document.createElement('div');
    badges.className = 'job-badges';
    
    // Work mode badge
    const modeBadge = document.createElement('span');
    modeBadge.className = `job-badge badge-${job.work_mode}`;
    modeBadge.textContent = job.work_mode === 'solo' ? 'Solo' : 'Group';
    badges.appendChild(modeBadge);
    
    // Urgent badge
    if (job.urgent_status) {
        const urgentBadge = document.createElement('span');
        urgentBadge.className = 'job-badge badge-urgent';
        urgentBadge.textContent = 'Urgent';
        badges.appendChild(urgentBadge);
    }
    
    // AI badge
    if (job.ai_allowed) {
        const aiBadge = document.createElement('span');
        aiBadge.className = 'job-badge badge-ai';
        aiBadge.textContent = 'AI OK';
        badges.appendChild(aiBadge);
    }
    
    // Online/Offline badge
    const locationBadge = document.createElement('span');
    locationBadge.className = `job-badge badge-${job.work_mode === 'solo' ? 'online' : 'offline'}`;
    locationBadge.textContent = job.work_mode === 'solo' ? 'ONLINE' : 'OFFLINE';
    badges.appendChild(locationBadge);
    
    // Job Footer
    const footer = document.createElement('div');
    footer.className = 'job-footer';
    
    const price = document.createElement('div');
    price.className = 'job-price';
    price.textContent = formatCurrency(job.current_price || job.base_price);
    
    const actions = document.createElement('div');
    actions.className = 'job-actions';
    
    // Add match badge if provided
    if (job.matchPercent !== undefined) {
        const matchBadge = document.createElement('span');
        matchBadge.className = 'match-badge';
        matchBadge.textContent = `${job.matchPercent}% Match`;
        footer.appendChild(matchBadge);
    }
    
    // Add action buttons if provided
    if (options.actions) {
        options.actions.forEach(action => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-primary';
            btn.textContent = action.label;
            btn.addEventListener('click', () => action.onClick(job));
            actions.appendChild(btn);
        });
    } else {
        const detailsBtn = document.createElement('button');
        detailsBtn.className = 'btn btn-primary';
        detailsBtn.textContent = 'Details →';
        detailsBtn.addEventListener('click', () => {
            window.location.href = `/job-details.html?id=${job.id}`;
        });
        actions.appendChild(detailsBtn);
    }
    
    footer.appendChild(price);
    footer.appendChild(actions);
    
    // Assemble card
    card.appendChild(meta);
    card.appendChild(client);
    card.appendChild(title);
    card.appendChild(badges);
    card.appendChild(footer);
    
    return card;
}

// My Jobs Page
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { createJobCard } from '../components/jobCard.js';

requireAuth();
requireRole(['client', 'both']);

async function loadMyJobs() {
    const jobsGrid = document.getElementById('jobs-grid');
    const emptyState = document.getElementById('empty-state');
    const statusFilter = document.getElementById('status-filter').value;
    
    try {
        jobsGrid.innerHTML = '';
        const data = await apiRequest(ENDPOINTS.JOBS);
        
        let jobs = data.jobs || data;
        if (statusFilter) {
            jobs = jobs.filter(j => j.status === statusFilter);
        }
        
        if (jobs.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        for (const job of jobs) {
            const card = await createJobCard(job, {
                actions: [
                    {
                        label: 'View Details →',
                        onClick: (job) => {
                            window.location.href = `/client/job-detail.html?id=${job.id}`;
                        }
                    }
                ]
            });
            jobsGrid.appendChild(card);
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        alert(error.message);
    }
}

document.getElementById('status-filter').addEventListener('change', loadMyJobs);

loadMyJobs();

// Post Job Page
import { requireAuth, requireRole } from '../auth.js';
import { apiUpload } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { showToast } from '../utils.js';

requireAuth();
requireRole(['client', 'both']);

// Toggle button handlers for work mode
const modeButtons = document.querySelectorAll('#mode-solo, #mode-group');
const workModeInput = document.getElementById('work-mode');

modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Only remove active from mode buttons
        modeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        workModeInput.value = btn.dataset.value;
    });
});

// Toggle button handlers for work location
const locationButtons = document.querySelectorAll('#location-online, #location-offline');
const workLocationInput = document.getElementById('work-location');

locationButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        // Only remove active from location buttons
        locationButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        workLocationInput.value = btn.dataset.value;
    });
});

// Auction mode logic - only show when urgent is enabled
const urgentCheckbox = document.getElementById('urgent-status');
const auctionModeGroup = document.getElementById('auction-mode-group');
const auctionCheckbox = document.getElementById('auction-mode');
const helperText = auctionModeGroup.querySelector('.helper-text');
const warningText = auctionModeGroup.querySelector('.warning-text');

urgentCheckbox.addEventListener('change', () => {
    if (urgentCheckbox.checked) {
        auctionModeGroup.style.display = 'block';
        warningText.style.display = 'none';
    } else {
        auctionModeGroup.style.display = 'none';
        auctionCheckbox.checked = false;
        helperText.style.display = 'none';
    }
});

auctionCheckbox.addEventListener('change', () => {
    if (auctionCheckbox.checked) {
        if (!urgentCheckbox.checked) {
            auctionCheckbox.checked = false;
            warningText.style.display = 'block';
            setTimeout(() => {
                warningText.style.display = 'none';
            }, 3000);
        } else {
            helperText.style.display = 'block';
        }
    } else {
        helperText.style.display = 'none';
    }
});

// Form submission
document.getElementById('post-job-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';
    
    try {
        const formData = new FormData(e.target);
        
        // Add boolean values as strings (backend expects string or boolean)
        formData.set('ai_allowed', document.getElementById('ai-allowed').checked ? 'true' : 'false');
        formData.set('urgent_status', urgentCheckbox.checked ? 'true' : 'false');
        formData.set('auction_mode', auctionCheckbox.checked ? 'true' : 'false');
        
        // Add pricing_mode (required by backend)
        formData.set('pricing_mode', 'fixed');
        
        // Format deadline to ISO string
        const deadline = document.getElementById('deadline').value;
        if (deadline) {
            formData.set('deadline', new Date(deadline).toISOString());
        }
        
        await apiUpload(ENDPOINTS.JOBS, formData);
        
        showToast('Job posted successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = '/client/dashboard.html';
        }, 1500);
        
    } catch (error) {
        showToast(error.message || 'Failed to post job', 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Post Job';
    }
});

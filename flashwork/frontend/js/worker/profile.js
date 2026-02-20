// Worker Profile Page
import { requireAuth, requireRole, getUser } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { showToast } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

const user = getUser();

// Load current profile
document.getElementById('name').value = user.name;
document.getElementById('email').value = user.email;

// Load additional profile data
async function loadProfile() {
    try {
        const data = await apiRequest(ENDPOINTS.PROFILE);
        
        if (data.education) {
            document.getElementById('education').value = data.education;
        }
        
        if (data.skills && Array.isArray(data.skills)) {
            document.getElementById('skills').value = data.skills.join(', ');
        }
        
        // Display reputation
        displayReputation(data.reputation || 3.0, data.ratingCount || 0);
        
    } catch (error) {
        console.error('Error loading profile:', error);
        showToast('Failed to load profile', 'error');
    }
}

function displayReputation(reputation, ratingCount) {
    // Update numeric score
    document.getElementById('reputation-score').textContent = reputation.toFixed(1);
    document.getElementById('rating-count').textContent = ratingCount;
    
    // Update star display
    const stars = document.querySelectorAll('#star-rating .star');
    const fullStars = Math.floor(reputation);
    const hasHalfStar = reputation % 1 >= 0.5;
    
    stars.forEach((star, index) => {
        if (index < fullStars) {
            star.textContent = '★'; // Filled star
            star.classList.add('filled');
        } else if (index === fullStars && hasHalfStar) {
            star.textContent = '⯨'; // Half star
            star.classList.add('half');
        } else {
            star.textContent = '☆'; // Empty star
            star.classList.remove('filled', 'half');
        }
    });
}

// Update profile
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const education = document.getElementById('education').value;
    const skillsInput = document.getElementById('skills').value;
    const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);
    
    try {
        await apiRequest(ENDPOINTS.PROFILE, {
            method: 'PATCH',
            body: JSON.stringify({ education, skills })
        });
        
        showToast('Profile updated successfully!', 'success');
    } catch (error) {
        showToast(error.message || 'Failed to update profile', 'error');
    }
});

loadProfile();

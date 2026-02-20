// Landing Page Logic
import { getUser, isAuthenticated, logout } from './auth.js';

// Check if user is logged in
const user = getUser();
const isLoggedIn = isAuthenticated();

// Update navbar based on auth status
if (isLoggedIn && user) {
    // Show user avatar with initials
    const avatarCircle = document.getElementById('user-avatar');
    const initials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
    avatarCircle.textContent = initials;
    
    // Show logout button
    document.getElementById('logout-btn').style.display = 'block';
    
    // Update dashboard and jobs buttons based on role
    const dashboardBtn = document.getElementById('dashboard-btn');
    const jobsBtn = document.getElementById('jobs-btn');
    
    if (user.role === 'worker' || user.role === 'both') {
        dashboardBtn.onclick = () => window.location.href = '/worker/dashboard.html';
        jobsBtn.onclick = () => window.location.href = '/worker/dashboard.html';
    } else if (user.role === 'client') {
        dashboardBtn.onclick = () => window.location.href = '/client/dashboard.html';
        jobsBtn.onclick = () => window.location.href = '/client/my-jobs.html';
    }
} else {
    // Hide logout button and avatar for non-logged-in users
    document.getElementById('logout-btn').style.display = 'none';
    document.getElementById('user-avatar').style.display = 'none';
    
    // Redirect dashboard/jobs buttons to login
    document.getElementById('dashboard-btn').onclick = () => window.location.href = '/login.html';
    document.getElementById('jobs-btn').onclick = () => window.location.href = '/login.html';
}

// Logout handler
document.getElementById('logout-btn').addEventListener('click', () => {
    if (confirm('Are you sure you want to logout?')) {
        logout();
    }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all feature cards
document.querySelectorAll('.feature-card, .feature-card-dark').forEach(card => {
    observer.observe(card);
});

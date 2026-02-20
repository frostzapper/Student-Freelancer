// Navbar Component
import { getUser, logout, isAuthenticated } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { formatCurrency } from '../utils.js';

async function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    
    try {
        const response = await fetch('/shared/navbar.html');
        const html = await response.text();
        navbarContainer.innerHTML = html;
        
        if (isAuthenticated()) {
            await setupAuthenticatedNav();
        } else {
            setupGuestNav();
        }
    } catch (error) {
        console.error('Error loading navbar:', error);
    }
}

async function setupAuthenticatedNav() {
    const user = getUser();
    const navLinks = document.getElementById('nav-links');
    
    let links = '';
    
    if (user.role === 'worker' || user.role === 'both') {
        links += `
            <a href="/worker/dashboard.html">Dashboard</a>
            <a href="/worker/browse.html">Browse Jobs</a>
            <a href="/worker/recommended.html">Best Jobs For Me</a>
            <a href="/worker/schedule.html">Schedule</a>
            <a href="/worker/wallet.html">Wallet</a>
        `;
    }
    
    if (user.role === 'client' || user.role === 'both') {
        links += `
            <a href="/client/dashboard.html">Dashboard</a>
            <a href="/client/post-job.html">Post Job</a>
            <a href="/client/my-jobs.html">My Jobs</a>
            <a href="/client/wallet.html">Wallet</a>
        `;
    }
    
    navLinks.innerHTML = links;
    
    // Load wallet balance
    try {
        const data = await apiRequest(ENDPOINTS.WALLET_BALANCE);
        document.getElementById('wallet-balance').textContent = formatCurrency(data.balance);
    } catch (error) {
        console.error('Error loading balance:', error);
    }
    
    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', logout);
}

function setupGuestNav() {
    const navLinks = document.getElementById('nav-links');
    navLinks.innerHTML = `
        <a href="/login.html">Login</a>
        <a href="/register.html">Register</a>
    `;
    
    document.querySelector('.nav-actions').style.display = 'none';
}

// Load navbar on page load
document.addEventListener('DOMContentLoaded', loadNavbar);

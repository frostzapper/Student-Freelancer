// Authentication Logic
import { apiRequest } from './api.js';
import { ENDPOINTS } from './config.js';

export function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isAuthenticated() {
    return !!getToken();
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

export function requireAuth() {
    if (!isAuthenticated()) {
        window.location.href = '/login.html';
    }
}

export function requireRole(allowedRoles) {
    const user = getUser();
    if (!user || !allowedRoles.includes(user.role)) {
        alert('Access denied');
        window.location.href = '/index.html';
    }
}

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            const data = await apiRequest(ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            
            // Check if data exists (apiRequest might return undefined on redirect)
            if (!data) {
                return;
            }
            
            if (!data.token || !data.user) {
                throw new Error('Invalid response from server');
            }
            
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redirect based on role
            if (data.user.role === 'worker' || data.user.role === 'both') {
                window.location.href = '/worker/dashboard.html';
            } else {
                window.location.href = '/client/dashboard.html';
            }
        } catch (error) {
            alert(error.message || 'Login failed. Please try again.');
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        
        try {
            await apiRequest(ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify({ name, email, password, role })
            });
            
            alert('Registration successful! Please login.');
            window.location.href = '/login.html';
        } catch (error) {
            alert(error.message);
        }
    });
}

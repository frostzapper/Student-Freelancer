// API Wrapper
import { API_BASE_URL } from './config.js';

export async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Auto-logout on authentication errors
            if (data.error === 'User not found' || data.error === 'Invalid token' || response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
                return;
            }
            throw new Error(data.error || data.message || 'Request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

export async function apiUpload(endpoint, formData) {
    const token = localStorage.getItem('token');
    
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers,
            body: formData
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Auto-logout on authentication errors
            if (data.error === 'User not found' || data.error === 'Invalid token' || response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login.html';
                return;
            }
            throw new Error(data.error || data.message || 'Upload failed');
        }
        
        return data;
    } catch (error) {
        console.error('Upload Error:', error);
        throw error;
    }
}

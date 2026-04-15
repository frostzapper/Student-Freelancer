// Utility Functions

export function formatCurrency(amount) {
    return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

export function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

export function getDayName(dayNumber) {
    const days = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayNumber];
}

export function showLoading(element) {
    element.innerHTML = '<p>Loading...</p>';
}

export function showError(element, message) {
    element.innerHTML = `<p class="error">${message}</p>`;
}

export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function showToast(message, type = 'info', duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        console.warn('Toast element not found');
        return;
    }
    
    // Clear any existing content
    toast.innerHTML = '';
    
    // Add message
    const messageSpan = document.createElement('span');
    messageSpan.textContent = message;
    toast.appendChild(messageSpan);
    
    // Add progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'toast-progress';
    progressBar.style.animationDuration = `${duration}ms`;
    toast.appendChild(progressBar);
    
    // Set toast type and show
    toast.className = `toast toast-${type} show`;
    
    // Auto-dismiss after duration
    setTimeout(() => {
        toast.className = 'toast';
    }, duration);
}

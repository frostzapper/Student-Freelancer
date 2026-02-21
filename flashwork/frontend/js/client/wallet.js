// Client Wallet Page
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { formatCurrency } from '../utils.js';

requireAuth();
requireRole(['client', 'both']);

async function loadBalance() {
    try {
        const data = await apiRequest(ENDPOINTS.WALLET_BALANCE);
        document.getElementById('balance').textContent = formatCurrency(data.balance);
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

document.getElementById('topup-btn').addEventListener('click', async () => {
    const amount = prompt('Enter amount to top up:');
    
    if (!amount || isNaN(amount)) {
        return;
    }
    
    try {
        await apiRequest(ENDPOINTS.WALLET_TOPUP, {
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(amount) })
        });
        
        alert('Wallet topped up successfully!');
        loadBalance();
    } catch (error) {
        alert(error.message);
    }
});

loadBalance();

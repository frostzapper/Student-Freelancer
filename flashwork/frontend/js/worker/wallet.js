// Worker Wallet Page
import { requireAuth, requireRole } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { formatCurrency } from '../utils.js';

requireAuth();
requireRole(['worker', 'both']);

async function loadBalance() {
    try {
        const data = await apiRequest(ENDPOINTS.WALLET_BALANCE);
        document.getElementById('balance').textContent = formatCurrency(data.balance);
    } catch (error) {
        console.error('Error loading balance:', error);
    }
}

document.getElementById('withdraw-btn').addEventListener('click', async () => {
    const amount = prompt('Enter amount to withdraw:');
    
    if (!amount || isNaN(amount)) {
        return;
    }
    
    try {
        await apiRequest(ENDPOINTS.WALLET_WITHDRAW, {
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(amount) })
        });
        
        alert('Withdrawal request submitted!');
        loadBalance();
    } catch (error) {
        alert(error.message);
    }
});

loadBalance();

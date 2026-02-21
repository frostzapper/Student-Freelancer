// Wallet Page - Universal for both clients and workers
import { requireAuth, getUser } from './auth.js';
import { apiRequest } from './api.js';
import { ENDPOINTS } from './config.js';
import { showToast } from './utils.js';
import { formatCurrency, formatDateTime } from './utils.js';

requireAuth();

const currentUser = getUser();

async function loadWallet() {
    try {
        // Load balance
        const balanceData = await apiRequest(ENDPOINTS.WALLET_BALANCE);
        document.getElementById('wallet-balance').textContent = formatCurrency(balanceData.balance);
        
        // Load transactions
        await loadTransactions();
        
    } catch (error) {
        console.error('Error loading wallet:', error);
        showToast('Failed to load wallet data', 'error');
    }
}

async function loadTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    const loadingState = document.getElementById('loading-transactions');
    const emptyState = document.getElementById('empty-transactions');
    
    try {
        loadingState.style.display = 'block';
        transactionsList.style.display = 'none';
        emptyState.style.display = 'none';
        
        // Get payment transactions
        const transactions = await apiRequest(ENDPOINTS.WALLET_TRANSACTIONS);
        
        loadingState.style.display = 'none';
        
        if (!transactions || transactions.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        // Store all transactions for filtering
        allTransactions = transactions;
        
        // Apply current filter
        filterTransactions();
        
    } catch (error) {
        console.error('Error loading transactions:', error);
        loadingState.innerHTML = '<p style="color: var(--accent-pink);">Error loading transactions</p>';
    }
}

function createTransactionRow(transaction) {
    const row = document.createElement('div');
    row.className = 'transaction-row';
    
    // Determine transaction type and styling
    let typeIcon = '';
    let typeLabel = '';
    let amountClass = '';
    let description = '';
    
    switch (transaction.type) {
        case 'topup':
            typeIcon = '💰';
            typeLabel = 'Top Up';
            amountClass = 'credit';
            description = 'Wallet top-up';
            break;
        case 'escrow':
            typeIcon = '🔒';
            typeLabel = 'Escrow Lock';
            amountClass = 'debit';
            description = 'Job payment locked in escrow';
            break;
        case 'payout':
            typeIcon = '💵';
            typeLabel = 'Payout';
            amountClass = 'credit';
            description = 'Job completion payment';
            break;
        case 'withdrawal':
            typeIcon = '🏦';
            typeLabel = 'Withdrawal';
            amountClass = 'debit';
            description = 'Withdrawal to bank';
            break;
        case 'refund':
            typeIcon = '↩️';
            typeLabel = 'Refund';
            amountClass = 'credit';
            description = 'Escrow refund';
            break;
        default:
            typeIcon = '💳';
            typeLabel = transaction.type;
            amountClass = transaction.amount > 0 ? 'credit' : 'debit';
            description = 'Transaction';
    }
    
    row.innerHTML = `
        <div class="transaction-icon">${typeIcon}</div>
        <div class="transaction-details">
            <div class="transaction-type">${typeLabel}</div>
            <div class="transaction-description">${description}</div>
            <div class="transaction-date">${formatDateTime(transaction.created_at)}</div>
        </div>
        <div class="transaction-amount ${amountClass}">
            ${amountClass === 'credit' ? '+' : '-'}${formatCurrency(Math.abs(transaction.amount))}
        </div>
        <div class="transaction-status status-${transaction.status}">
            ${transaction.status}
        </div>
    `;
    
    return row;
}

// Top Up Modal
document.getElementById('topup-btn').addEventListener('click', () => {
    document.getElementById('topup-modal').style.display = 'flex';
    document.getElementById('topup-amount').value = '';
    document.getElementById('topup-amount').focus();
});

document.getElementById('close-topup-modal').addEventListener('click', () => {
    document.getElementById('topup-modal').style.display = 'none';
});

document.getElementById('cancel-topup').addEventListener('click', () => {
    document.getElementById('topup-modal').style.display = 'none';
});

document.getElementById('submit-topup').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('topup-amount').value);
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount < 100) {
        showToast('Minimum top-up amount is ₹100', 'error');
        return;
    }
    
    if (amount > 100000) {
        showToast('Maximum top-up amount is ₹100,000', 'error');
        return;
    }
    
    try {
        document.getElementById('submit-topup').disabled = true;
        document.getElementById('submit-topup').textContent = 'Processing...';
        
        await apiRequest(ENDPOINTS.WALLET_TOPUP, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
        
        showToast(`Successfully added ${formatCurrency(amount)} to your wallet!`, 'success');
        
        document.getElementById('topup-modal').style.display = 'none';
        
        // Reload wallet data
        setTimeout(() => {
            loadWallet();
        }, 1000);
        
    } catch (error) {
        showToast(error.message || 'Failed to top up wallet', 'error');
    } finally {
        document.getElementById('submit-topup').disabled = false;
        document.getElementById('submit-topup').textContent = 'Top Up';
    }
});

// Withdraw Modal
document.getElementById('withdraw-btn').addEventListener('click', () => {
    document.getElementById('withdraw-modal').style.display = 'flex';
    document.getElementById('withdraw-amount').value = '';
    document.getElementById('withdraw-amount').focus();
});

document.getElementById('close-withdraw-modal').addEventListener('click', () => {
    document.getElementById('withdraw-modal').style.display = 'none';
});

document.getElementById('cancel-withdraw').addEventListener('click', () => {
    document.getElementById('withdraw-modal').style.display = 'none';
});

document.getElementById('submit-withdraw').addEventListener('click', async () => {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (!amount || amount <= 0) {
        showToast('Please enter a valid amount', 'error');
        return;
    }
    
    if (amount < 100) {
        showToast('Minimum withdrawal amount is ₹100', 'error');
        return;
    }
    
    try {
        document.getElementById('submit-withdraw').disabled = true;
        document.getElementById('submit-withdraw').textContent = 'Processing...';
        
        await apiRequest(ENDPOINTS.WALLET_WITHDRAW, {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
        
        showToast(`Withdrawal request for ${formatCurrency(amount)} submitted!`, 'success');
        
        document.getElementById('withdraw-modal').style.display = 'none';
        
        // Reload wallet data
        setTimeout(() => {
            loadWallet();
        }, 1000);
        
    } catch (error) {
        showToast(error.message || 'Failed to withdraw', 'error');
    } finally {
        document.getElementById('submit-withdraw').disabled = false;
        document.getElementById('submit-withdraw').textContent = 'Withdraw';
    }
});

// Close modals on outside click
document.getElementById('topup-modal').addEventListener('click', (e) => {
    if (e.target.id === 'topup-modal') {
        document.getElementById('topup-modal').style.display = 'none';
    }
});

document.getElementById('withdraw-modal').addEventListener('click', (e) => {
    if (e.target.id === 'withdraw-modal') {
        document.getElementById('withdraw-modal').style.display = 'none';
    }
});

// Quick amount buttons for top-up
document.querySelectorAll('.quick-amount').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const amount = e.target.dataset.amount;
        document.getElementById('topup-amount').value = amount;
    });
});

// Filter buttons
let currentFilter = 'all';
let allTransactions = [];

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Update active state
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        // Apply filter
        currentFilter = e.target.dataset.filter;
        filterTransactions();
    });
});

function filterTransactions() {
    const transactionsList = document.getElementById('transactions-list');
    transactionsList.innerHTML = '';
    
    let filtered = allTransactions;
    
    if (currentFilter === 'credit') {
        filtered = allTransactions.filter(t => ['topup', 'payout', 'refund'].includes(t.type));
    } else if (currentFilter === 'debit') {
        filtered = allTransactions.filter(t => ['escrow', 'withdrawal'].includes(t.type));
    }
    
    if (filtered.length === 0) {
        document.getElementById('empty-transactions').style.display = 'block';
        transactionsList.style.display = 'none';
    } else {
        document.getElementById('empty-transactions').style.display = 'none';
        transactionsList.style.display = 'block';
        
        filtered.forEach(transaction => {
            const row = createTransactionRow(transaction);
            transactionsList.appendChild(row);
        });
    }
}

loadWallet();

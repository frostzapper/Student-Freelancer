// Worker Schedule Manager
import { requireAuth, getUser } from '../auth.js';
import { apiRequest } from '../api.js';
import { ENDPOINTS } from '../config.js';
import { showToast } from '../utils.js';

requireAuth();

const currentUser = getUser();

// Check if user is a worker
if (!currentUser.role.includes('worker')) {
    showToast('Access denied. Workers only.', 'error');
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
}

let allSlots = [];

async function loadSchedule() {
    const loadingState = document.getElementById('loading-schedule');
    const scheduleGrid = document.getElementById('schedule-grid');
    
    try {
        loadingState.style.display = 'block';
        scheduleGrid.style.display = 'none';
        
        // Fetch schedule slots
        const slots = await apiRequest(ENDPOINTS.SCHEDULE);
        
        allSlots = slots || [];
        
        loadingState.style.display = 'none';
        scheduleGrid.style.display = 'grid';
        
        // Render slots in the grid
        renderSchedule();
        
    } catch (error) {
        console.error('Error loading schedule:', error);
        loadingState.innerHTML = '<p style="color: var(--accent-pink);">Error loading schedule</p>';
    }
}

function renderSchedule() {
    // Clear all slot containers
    document.querySelectorAll('.slots-container').forEach(container => {
        container.innerHTML = '';
    });
    
    // Group slots by day
    const slotsByDay = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    };
    
    allSlots.forEach(slot => {
        const day = slot.day_of_week.toLowerCase();
        if (slotsByDay[day]) {
            slotsByDay[day].push(slot);
        }
    });
    
    // Render slots for each day
    Object.keys(slotsByDay).forEach(day => {
        const container = document.querySelector(`.slots-container[data-day="${day}"]`);
        const daySlots = slotsByDay[day];
        
        if (daySlots.length === 0) {
            container.innerHTML = '<div class="empty-day">No slots</div>';
        } else {
            // Sort slots by start time
            daySlots.sort((a, b) => a.start_time.localeCompare(b.start_time));
            
            daySlots.forEach(slot => {
                const slotElement = createSlotElement(slot);
                container.appendChild(slotElement);
            });
        }
    });
}

function createSlotElement(slot) {
    const slotDiv = document.createElement('div');
    slotDiv.className = 'time-slot';
    
    // Format time (HH:MM:SS to HH:MM AM/PM)
    const startTime = formatTime(slot.start_time);
    const endTime = formatTime(slot.end_time);
    
    slotDiv.innerHTML = `
        <div class="slot-time">
            <span class="time-start">${startTime}</span>
            <span class="time-separator">→</span>
            <span class="time-end">${endTime}</span>
        </div>
        <button class="slot-delete" data-id="${slot.id}" title="Delete slot">
            🗑️
        </button>
    `;
    
    // Add delete handler
    slotDiv.querySelector('.slot-delete').addEventListener('click', async (e) => {
        e.stopPropagation();
        const slotId = e.target.dataset.id;
        await deleteSlot(slotId);
    });
    
    return slotDiv;
}

function formatTime(timeString) {
    // Convert HH:MM:SS to 12-hour format
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
}

async function deleteSlot(slotId) {
    if (!confirm('Are you sure you want to delete this time slot?')) {
        return;
    }
    
    try {
        await apiRequest(`${ENDPOINTS.SCHEDULE}/${slotId}`, {
            method: 'DELETE'
        });
        
        showToast('Time slot deleted successfully', 'success');
        
        // Reload schedule
        await loadSchedule();
        
    } catch (error) {
        showToast(error.message || 'Failed to delete time slot', 'error');
    }
}

// Modal handlers
document.getElementById('add-slot-btn').addEventListener('click', () => {
    openSlotModal();
});

document.querySelectorAll('.add-day-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const day = e.target.dataset.day;
        openSlotModal(day);
    });
});

function openSlotModal(preselectedDay = null) {
    const modal = document.getElementById('slot-modal');
    modal.style.display = 'flex';
    
    // Reset form
    document.getElementById('slot-start').value = '';
    document.getElementById('slot-end').value = '';
    
    if (preselectedDay) {
        document.getElementById('slot-day').value = preselectedDay;
    }
    
    document.getElementById('slot-start').focus();
}

function closeSlotModal() {
    document.getElementById('slot-modal').style.display = 'none';
}

document.getElementById('close-slot-modal').addEventListener('click', closeSlotModal);
document.getElementById('cancel-slot').addEventListener('click', closeSlotModal);

document.getElementById('submit-slot').addEventListener('click', async () => {
    const day = document.getElementById('slot-day').value;
    const startTime = document.getElementById('slot-start').value;
    const endTime = document.getElementById('slot-end').value;
    
    if (!startTime || !endTime) {
        showToast('Please enter both start and end times', 'error');
        return;
    }
    
    // Validate that end time is after start time
    if (startTime >= endTime) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    try {
        document.getElementById('submit-slot').disabled = true;
        document.getElementById('submit-slot').textContent = 'Adding...';
        
        await apiRequest(ENDPOINTS.SCHEDULE, {
            method: 'POST',
            body: JSON.stringify({
                day_of_week: day,
                start_time: startTime + ':00',
                end_time: endTime + ':00'
            })
        });
        
        showToast('Time slot added successfully!', 'success');
        
        closeSlotModal();
        
        // Reload schedule
        await loadSchedule();
        
    } catch (error) {
        showToast(error.message || 'Failed to add time slot', 'error');
    } finally {
        document.getElementById('submit-slot').disabled = false;
        document.getElementById('submit-slot').textContent = 'Add Slot';
    }
});

// Close modal on outside click
document.getElementById('slot-modal').addEventListener('click', (e) => {
    if (e.target.id === 'slot-modal') {
        closeSlotModal();
    }
});

// Load schedule on page load
loadSchedule();

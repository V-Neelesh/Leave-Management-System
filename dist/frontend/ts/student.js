"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Logout button logic
window.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Optionally clear session/local storage here
            window.location.href = 'login.html';
        });
    }
});
const api_1 = require("../utils/api");
async function submitLeaveRequest(request) {
    const payload = {
        leaveType: request.type_of_leave,
        startDate: request.date_start,
        endDate: request.date_end,
        reason: request.leave_reason,
    };
    const res = await api_1.apiClient.post('/leaves/apply', payload);
    return { success: res.success, message: res.message };
}
// Fetch applied leave requests for the student
async function fetchAppliedRequests(accountId) {
    const res = await api_1.apiClient.get('/leaves/student');
    return res.success ? res.data : [];
}
// Render leave requests in the table
function renderRequests(requests) {
    const tbody = document.getElementById('requestBody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    requests.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${req.studentId || ''}</td>
            <td>${req.leaveType || ''}</td>
            <td>${req.startDate || ''}</td>
            <td>${req.endDate || ''}</td>
            <td>${req.status || 'pending'}</td>
        `;
        tbody.appendChild(tr);
    });
}
function handleLeaveForm(event) {
    event.preventDefault();
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== 'student') {
        alert('Unauthorized. Please login as student.');
        window.location.href = 'login.html';
        return;
    }
    const account_id = Number(user.id);
    const type_of_leave = document.getElementById('leave_type').value;
    const date_start = document.getElementById('start_date').value;
    const date_end = document.getElementById('end_date').value;
    const days_total = parseInt(document.getElementById('Total_Days').value, 10);
    const leave_reason = document.getElementById('reason').value;
    const request = {
        account_id,
        type_of_leave,
        date_start,
        date_end,
        days_total,
        leave_reason,
    };
    submitLeaveRequest(request).then((response) => {
        if (response.success) {
            alert('Leave request submitted successfully!');
            document.getElementById('leaveForm').reset();
            // Refresh applied requests table
            fetchAppliedRequests(account_id).then(renderRequests);
        }
        else {
            alert(response.message);
        }
    });
}
window.addEventListener('DOMContentLoaded', () => {
    // Logout button logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Optionally clear session/local storage here
            window.location.href = 'login.html';
        });
    }
    const leaveForm = document.getElementById('leaveForm');
    if (leaveForm) {
        leaveForm.addEventListener('submit', handleLeaveForm);
    }
    // Auto-calculate total days
    const startDateInput = document.getElementById('start_date');
    const endDateInput = document.getElementById('end_date');
    const totalDaysInput = document.getElementById('Total_Days');
    function updateTotalDays() {
        if (startDateInput.value && endDateInput.value) {
            const start = new Date(startDateInput.value);
            const end = new Date(endDateInput.value);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                // Calculate difference in days (inclusive)
                const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                totalDaysInput.value = diff.toString();
            }
            else {
                totalDaysInput.value = '';
            }
        }
        else {
            totalDaysInput.value = '';
        }
    }
    if (startDateInput && endDateInput && totalDaysInput) {
        startDateInput.addEventListener('change', updateTotalDays);
        endDateInput.addEventListener('change', updateTotalDays);
    }
    // Guard: ensure correct role and load requests
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== 'student') {
        window.location.href = 'login.html';
        return;
    }
    fetchAppliedRequests(Number(user.id)).then(renderRequests);
});

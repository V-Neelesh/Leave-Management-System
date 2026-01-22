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
// Fetch all leave requests
async function fetchAllRequests() {
    const res = await api_1.apiClient.get('/leaves/all');
    return res.success ? res.data : [];
}
// Approve or reject a leave request
async function updateRequestStatus(id, status) {
    const endpoint = status === 'Approved' ? '/leaves/approve/' + id : '/leaves/reject/' + id;
    const res = await api_1.apiClient.put(endpoint, {});
    return { success: res.success };
}
// Render requests in the dashboard
function renderHodRequests(requests) {
    const tbody = document.getElementById('hodRequestBody');
    if (!tbody)
        return;
    tbody.innerHTML = '';
    requests.forEach(req => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
			<td>${req.studentId || ''}</td>
			<td>${(req.student && req.student.name) || ''}</td>
			<td>${req.leaveType || ''}</td>
			<td>${req.startDate || ''}</td>
			<td>${req.endDate || ''}</td>
			<td>${req.days_total || ''}</td>
			<td>${req.reason || ''}</td>
			<td>${req.status || 'pending'}</td>
			<td>
				${req.status === 'pending' ? `
				<button class="approve-btn" data-id="${req.id}">Approve</button>
				<button class="reject-btn" data-id="${req.id}">Reject</button>
				` : ''}
			</td>
		`;
        tbody.appendChild(tr);
    });
    // Add event listeners for approve/reject buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (id)
                handleStatusChange(Number(id), 'Approved');
        });
    });
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            if (id)
                handleStatusChange(Number(id), 'Rejected');
        });
    });
}
function handleStatusChange(id, status) {
    updateRequestStatus(id, status).then(() => {
        fetchAllRequests().then(renderHodRequests);
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
    // Guard: ensure HOD role
    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== 'hod') {
        window.location.href = 'login.html';
        return;
    }
    fetchAllRequests().then(renderHodRequests);
});

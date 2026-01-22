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
import { apiClient } from '../utils/api';

interface ApplicationRequest {
    account_id: number;
    type_of_leave: string;
    date_start: string;
    date_end: string;
    days_total: number;
    leave_reason: string;
}

interface LeaveResponse {
    success: boolean;
    message: string;
}

async function submitLeaveRequest(request: ApplicationRequest): Promise<LeaveResponse> {
    const payload = {
        leaveType: request.type_of_leave,
        startDate: request.date_start,
        endDate: request.date_end,
        reason: request.leave_reason,
    };
    const res = await apiClient.post<LeaveResponse>('/leaves/apply', payload);
    return { success: res.success, message: res.message };
}

// Fetch applied leave requests for the student
async function fetchAppliedRequests(accountId?: number) {
    const res = await apiClient.get<any[]>('/leaves/student');
    return res.success ? (res.data as any[]) : [];
}

// Render leave requests in the table
function renderRequests(requests: any[]) {
    const tbody = document.getElementById('requestBody');
    if (!tbody) return;
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

function handleLeaveForm(event: Event) {
    event.preventDefault();

    const userRaw = localStorage.getItem('user');
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (!user || user.role !== 'student') {
        alert('Unauthorized. Please login as student.');
        window.location.href = 'login.html';
        return;
    }

    const account_id = Number(user.id);
    const type_of_leave = (document.getElementById('leave_type') as HTMLSelectElement).value;
    const date_start = (document.getElementById('start_date') as HTMLInputElement).value;
    const date_end = (document.getElementById('end_date') as HTMLInputElement).value;
    const days_total = parseInt((document.getElementById('Total_Days') as HTMLInputElement).value, 10);
    const leave_reason = (document.getElementById('reason') as HTMLTextAreaElement).value;

    const request: ApplicationRequest = {
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
            (document.getElementById('leaveForm') as HTMLFormElement).reset();
            // Refresh applied requests table
            fetchAppliedRequests(account_id).then(renderRequests);
        } else {
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
    const startDateInput = document.getElementById('start_date') as HTMLInputElement;
    const endDateInput = document.getElementById('end_date') as HTMLInputElement;
    const totalDaysInput = document.getElementById('Total_Days') as HTMLInputElement;

    function updateTotalDays() {
        if (startDateInput.value && endDateInput.value) {
            const start = new Date(startDateInput.value);
            const end = new Date(endDateInput.value);
            if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && end >= start) {
                // Calculate difference in days (inclusive)
                const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                totalDaysInput.value = diff.toString();
            } else {
                totalDaysInput.value = '';
            }
        } else {
            totalDaysInput.value = '';
        }
    }

    if (startDateInput && endDateInput && totalDaysInput) {
        ['change', 'input'].forEach(evt => {
            startDateInput.addEventListener(evt, updateTotalDays);
            endDateInput.addEventListener(evt, updateTotalDays);
        });
        updateTotalDays();
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

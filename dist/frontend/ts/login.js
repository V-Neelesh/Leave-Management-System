"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("../utils/api");
async function loginUser(request) {
    try {
        const response = await api_1.apiClient.post('/login', request);
        return {
            success: response.success,
            message: response.message,
            token: response.data?.token,
            user: response.data?.user
        };
    }
    catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again later.',
        };
    }
}
function handleLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const roleSelect = document.getElementById('role');
    const username = usernameInput.value;
    const password = passwordInput.value;
    const role = roleSelect.value;
    const request = { username, password, role };
    loginUser(request).then((response) => {
        if (response.success && response.token) {
            // Store token and user info in localStorage
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('userRole', role);
            if (response.user) {
                localStorage.setItem('user', JSON.stringify(response.user));
            }
            alert('Login successful!');
            // Redirect based on role
            if (role === 'student') {
                window.location.href = 'student.html';
            }
            else if (role === 'hod') {
                window.location.href = 'hod.html';
            }
        }
        else {
            alert(response.message || 'Login failed. Please check your credentials.');
        }
    });
}
window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});

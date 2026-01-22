interface LoginResponse {
    success: boolean;
    message: string;
    token?: string;
    user?: {
        id: number;
        username: string;
        role: string;
        name?: string;
    };
}

interface LoginRequest {
    username: string;
    password: string;
    role: string;
}

import { apiClient } from '../utils/api';

async function loginUser(request: LoginRequest): Promise<LoginResponse> {
    try {
        const response = await apiClient.post('/login', request);
        return {
            success: response.success,
            message: response.message,
            token: (response.data as any)?.token,
            user: (response.data as any)?.user
        };
    } catch (error) {
        return {
            success: false,
            message: 'Network error. Please try again later.',
        };
    }
}

function handleLogin(event: Event) {
    event.preventDefault();
    const usernameInput = document.getElementById('username') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    const roleSelect = document.getElementById('role') as HTMLSelectElement;
    const username = usernameInput.value;
    const password = passwordInput.value;
    const role = roleSelect.value;

    const request: LoginRequest = { username, password, role };
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
            } else if (role === 'hod') {
                window.location.href = 'hod.html';
            }
        } else {
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.ApiClient = void 0;
class ApiClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
        this.token = localStorage.getItem('authToken');
    }
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }
    async handleResponse(response) {
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Request failed',
                data: data.data
            };
        }
        return {
            success: true,
            message: data.message || 'Request successful',
            data: data.data || data
        };
    }
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.getHeaders(),
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.',
            };
        }
    }
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.',
            };
        }
    }
    async put(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'PUT',
                headers: this.getHeaders(),
                body: JSON.stringify(data),
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.',
            };
        }
    }
    async delete(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'DELETE',
                headers: this.getHeaders(),
            });
            return this.handleResponse(response);
        }
        catch (error) {
            return {
                success: false,
                message: 'Network error. Please try again later.',
            };
        }
    }
    setToken(token) {
        this.token = token;
        localStorage.setItem('authToken', token);
    }
    getToken() {
        return this.token;
    }
    clearToken() {
        this.token = null;
        localStorage.removeItem('authToken');
    }
    isAuthenticated() {
        return !!this.token;
    }
}
exports.ApiClient = ApiClient;
// Create a default instance
exports.apiClient = new ApiClient('');

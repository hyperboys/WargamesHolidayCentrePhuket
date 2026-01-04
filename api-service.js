// API Service Module
// Handle all API calls to the backend

const API_BASE_URL = 'http://localhost:3000/api';

class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    // Get token from storage
    getToken() {
        return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    }

    // Get user from storage
    getUser() {
        const userStr = localStorage.getItem('adminUser') || sessionStorage.getItem('adminUser');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Clear auth data
    clearAuth() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        sessionStorage.removeItem('adminToken');
        sessionStorage.removeItem('adminUser');
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    }

    // Check if user is admin
    isAdmin() {
        const user = this.getUser();
        return user && user.role === 'admin';
    }

    // Make API request
    async request(endpoint, options = {}) {
        const token = this.getToken();
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add token if available
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            // Handle unauthorized
            if (response.status === 401) {
                this.clearAuth();
                window.location.href = 'login.html';
                throw new Error('Session expired. Please login again.');
            }

            if (!response.ok) {
                throw new Error(data.error || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth APIs
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } finally {
            this.clearAuth();
            window.location.href = 'login.html';
        }
    }

    async getMe() {
        return this.request('/auth/me');
    }

    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // Booking APIs
    async getBookingStats() {
        return this.request('/booking/stats');
    }

    async getAllBookings(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/booking/all?${queryString}`);
    }

    async getBookings(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/booking?${queryString}`);
    }

    async getBookingById(bookingId) {
        return this.request(`/booking/${bookingId}`);
    }

    async updateBookingStatus(bookingId, status) {
        return this.request(`/booking/${bookingId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // User Management APIs
    async getUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users?${queryString}`);
    }

    async getUserById(userId) {
        return this.request(`/users/${userId}`);
    }

    async updateUser(userId, userData) {
        return this.request(`/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    async deleteUser(userId) {
        return this.request(`/users/${userId}`, {
            method: 'DELETE'
        });
    }

    async toggleUserActive(userId) {
        return this.request(`/users/${userId}/toggle-active`, {
            method: 'PUT'
        });
    }
}

// Create singleton instance
const apiService = new APIService();

// Export for use in other files
window.apiService = apiService;

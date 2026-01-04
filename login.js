// Login Page JavaScript

const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    const token = localStorage.getItem('adminToken');
    if (token) {
        // Verify token is still valid
        verifyToken(token);
    }

    // Setup form
    setupLoginForm();
    setupPasswordToggle();
});

// Setup Login Form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!username || !password) {
            showError('Please enter username and password');
            return;
        }
        
        await handleLogin(username, password, rememberMe);
    });
}

// Setup Password Toggle
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    toggleBtn.addEventListener('click', function() {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-eye');
        icon.classList.toggle('fa-eye-slash');
    });
}

// Handle Login
async function handleLogin(username, password, rememberMe) {
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoading = loginBtn.querySelector('.btn-loading');
    
    try {
        // Show loading state
        loginBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoading.style.display = 'flex';
        hideError();
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || 'Login failed');
        }
        
        if (result.success) {
            const { token, user } = result.data;
            
            // Store token
            if (rememberMe) {
                localStorage.setItem('adminToken', token);
                localStorage.setItem('adminUser', JSON.stringify(user));
            } else {
                sessionStorage.setItem('adminToken', token);
                sessionStorage.setItem('adminUser', JSON.stringify(user));
            }
            
            // Show success and redirect
            showSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1000);
        } else {
            throw new Error('Invalid response from server');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        showError(getErrorMessage(error));
        
        // Reset button state
        loginBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Verify Token
async function verifyToken(token) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            // Token is valid, redirect to admin
            window.location.href = 'admin.html';
        } else {
            // Token is invalid, clear it
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            sessionStorage.removeItem('adminToken');
            sessionStorage.removeItem('adminUser');
        }
    } catch (error) {
        console.error('Token verification error:', error);
    }
}

// Show Error
function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

// Hide Error
function hideError() {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.style.display = 'none';
}

// Show Success
function showSuccess(message) {
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    
    errorAlert.className = 'alert alert-success';
    errorAlert.style.background = 'rgba(16, 185, 129, 0.1)';
    errorAlert.style.color = '#10b981';
    errorAlert.style.borderColor = '#10b981';
    
    errorMessage.textContent = message;
    errorAlert.style.display = 'flex';
}

// Get Error Message
function getErrorMessage(error) {
    if (error.message.includes('fetch')) {
        return 'Cannot connect to server. Please check if the backend is running.';
    }
    
    if (error.message.includes('Invalid credentials')) {
        return 'Invalid username or password.';
    }
    
    if (error.message.includes('inactive')) {
        return 'Your account has been deactivated. Please contact administrator.';
    }
    
    return error.message || 'An error occurred. Please try again.';
}

// Handle Enter Key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const form = document.getElementById('loginForm');
        form.dispatchEvent(new Event('submit'));
    }
});

// Login Page JavaScript
// Uses apiService from api-service.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize language
    initLanguage();
    
    // Check if already logged in
    if (apiService.isAuthenticated()) {
        // Verify token is still valid
        verifyToken();
    }

    // Setup form
    setupLoginForm();
    setupPasswordToggle();
});

// Initialize Language
function initLanguage() {
    // Get saved language or default to English
    const savedLang = localStorage.getItem('language') || 'en';
    currentLang = savedLang;
    updatePageLanguage();
}

// Toggle Language
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'th' : 'en';
    setLanguage(newLang);
}

// Setup Login Form
function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        if (!username || !password) {
            showError(translations[currentLang].loginError);
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
        
        // Use apiService to login
        const result = await apiService.login(username, password);
        
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
            showSuccess(translations[currentLang].loginSuccess);
            
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
async function verifyToken() {
    try {
        const result = await apiService.getMe();
        
        if (result.success) {
            // Token is valid, redirect to admin
            window.location.href = 'admin.html';
        }
    } catch (error) {
        console.error('Token verification error:', error);
        // Token is invalid, clear it
        apiService.clearAuth();
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
    if (error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
        return currentLang === 'th' 
            ? 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบว่า Backend กำลังทำงานอยู่'
            : 'Cannot connect to server. Please check if the backend is running.';
    }
    
    if (error.message.includes('Invalid credentials') || error.message.includes('401') || error.message.includes('Unauthorized')) {
        return currentLang === 'th' 
            ? '❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง'
            : '❌ Invalid username or password. Please try again.';
    }
    
    if (error.message.includes('inactive')) {
        return currentLang === 'th'
            ? 'บัญชีของคุณถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ'
            : 'Your account has been deactivated. Please contact administrator.';
    }
    
    return error.message || (currentLang === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'An error occurred. Please try again.');
}

// Handle Enter Key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const form = document.getElementById('loginForm');
        form.dispatchEvent(new Event('submit'));
    }
});

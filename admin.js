// Admin Dashboard JavaScript - Connected to Real API

// Global variables
let currentBookingId = null;
let currentPage = 1;
let currentFilters = {};
let revenueChart = null;
let gamesChart = null;

// Initialize
document.addEventListener('DOMContentLoaded', async function() {
    // Initialize language
    initLanguage();
    
    // Check authentication
    if (!apiService.isAuthenticated()) {
        window.location.href = 'login.html';
        return;
    }

    try {
        // Load user info
        await loadUserInfo();
        
        // Initialize UI
        initNavigation();
        initMenuToggle();
        initModals();
        initFilters();
        
        // Load dashboard data
        await loadDashboardData();
        
        // Show/hide admin-only features
        toggleAdminFeatures();
    } catch (error) {
        console.error('Initialization error:', error);
        showNotification('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
    }
});

// Initialize Language
function initLanguage() {
    // Get saved language or default to English
    const savedLang = localStorage.getItem('language');
    if (!savedLang) {
        // First time or no saved language, set to English
        currentLang = 'en';
        localStorage.setItem('language', 'en');
    } else {
        currentLang = savedLang;
    }
    updatePageLanguage();
}

// Toggle Language
function toggleLanguage() {
    const newLang = currentLang === 'en' ? 'th' : 'en';
    setLanguage(newLang);
    // Reload dashboard stats to update currency (now at index 3)
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 4) {
        const currentValue = statCards[3].textContent.replace(/[^0-9.]/g, '');
        if (currentValue) {
            statCards[3].textContent = formatCurrency(parseFloat(currentValue));
        }
    }
}

// Format Currency based on language
function formatCurrency(amount) {
    if (currentLang === 'th') {
        return '฿' + amount.toLocaleString('th-TH');
    } else {
        return '$' + amount.toLocaleString('en-US');
    }
}

// Load User Info
async function loadUserInfo() {
    try {
        const response = await apiService.getMe();
        const user = response.data;
        
        // Update username display
        document.getElementById('userName').textContent = user.username;
        
        // Store user data
        if (localStorage.getItem('adminToken')) {
            localStorage.setItem('adminUser', JSON.stringify(user));
        } else {
            sessionStorage.setItem('adminUser', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Failed to load user info:', error);
        apiService.clearAuth();
        window.location.href = 'login.html';
    }
}

// Toggle Admin Features
function toggleAdminFeatures() {
    const isAdmin = apiService.isAdmin();
    const usersNav = document.getElementById('usersNav');
    
    if (usersNav) {
        usersNav.style.display = isAdmin ? 'flex' : 'none';
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // Load stats
        const statsResponse = await apiService.getBookingStats();
        console.log('Dashboard stats response:', statsResponse);
        
        if (statsResponse) {
            const data = statsResponse.data || statsResponse;
            updateDashboardStats(data);
            
            // Load recent bookings
            const recentBookings = data.recent || [];
            loadRecentBookings(recentBookings);
            
            // Initialize charts
            initCharts(data);
        }
        
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Show error in console but don't alert
        const tbody = document.getElementById('recentBookingsTable');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">เกิดข้อผิดพลาด: ' + error.message + '</td></tr>';
        }
    }
}

// Update Dashboard Stats
function updateDashboardStats(stats) {
    console.log('Updating dashboard stats:', stats);
    
    // Update stat cards in new order: Today, Pending, Confirmed, Revenue
    const statCards = document.querySelectorAll('.stat-number');
    if (statCards.length >= 4) {
        statCards[0].textContent = stats.today || 0;
        statCards[1].textContent = (stats.byStatus?.pending || 0);
        statCards[2].textContent = (stats.byStatus?.confirmed || 0);
        // Use confirmed revenue only from revenueByStatus
        const confirmedRevenue = stats.revenueByStatus?.confirmed || 0;
        statCards[3].textContent = formatCurrency(confirmedRevenue);
    }
}

// Navigation
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', async function(e) {
            e.preventDefault();
            
            if (this.classList.contains('logout')) {
                if (confirm('ต้องการออกจากระบบหรือไม่?')) {
                    await apiService.logout();
                }
                return;
            }
            
            const page = this.getAttribute('data-page');
            if (!page) return;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Update page
            const pages = document.querySelectorAll('.page');
            pages.forEach(p => p.classList.remove('active'));
            const pageElement = document.getElementById(page + '-page');
            if (pageElement) {
                pageElement.classList.add('active');
            }
            
            // Update title
            const title = this.querySelector('span').textContent;
            document.getElementById('pageTitle').textContent = title;
            
            // Load page data
            await loadPageData(page);
            
            // Close sidebar on mobile
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });
}

// Load Page Data
async function loadPageData(page) {
    try {
        switch(page) {
            case 'dashboard':
                await loadDashboardData();
                break;
            case 'bookings':
                await loadBookingsPage();
                break;
            case 'users':
                await loadUsersPage();
                break;
        }
    } catch (error) {
        console.error('Failed to load page data:', error);
        // Don't show alert for every page load error
    }
}

// Menu Toggle
function initMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            if (sidebar && !sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Charts
function initCharts(stats) {
    // Destroy existing charts before creating new ones
    if (revenueChart) {
        revenueChart.destroy();
        revenueChart = null;
    }
    if (gamesChart) {
        gamesChart.destroy();
        gamesChart = null;
    }
    
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'],
                datasets: [{
                    label: 'จำนวนการจอง',
                    data: generateMonthlyData(stats.total || 0),
                    borderColor: '#2563eb',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Games Chart
    const gamesCtx = document.getElementById('gamesChart');
    if (gamesCtx) {
        gamesChart = new Chart(gamesCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
                datasets: [{
                    data: [
                        stats.byStatus?.pending || 0,
                        stats.byStatus?.confirmed || 0,
                        stats.byStatus?.completed || 0,
                        stats.byStatus?.cancelled || 0
                    ],
                    backgroundColor: [
                        '#f59e0b',
                        '#10b981',
                        '#2563eb',
                        '#ef4444'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Generate Monthly Data
function generateMonthlyData(total) {
    const data = [];
    const avgPerMonth = Math.floor(total / 12);
    for (let i = 0; i < 12; i++) {
        data.push(avgPerMonth + Math.floor(Math.random() * 20) - 10);
    }
    return data;
}

// Load Recent Bookings
function loadRecentBookings(bookings) {
    const tbody = document.getElementById('recentBookingsTable');
    if (!tbody) {
        console.error('Recent bookings table not found');
        return;
    }
    
    console.log('Loading recent bookings:', bookings);
    
    if (!Array.isArray(bookings) || bookings.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">ไม่มีข้อมูลการจอง</td></tr>';
        return;
    }
    
    tbody.innerHTML = bookings.map(booking => `
        <tr>
            <td>${booking.bookingId}</td>
            <td>${booking.firstName} ${booking.lastName || ''}</td>
            <td>${booking.selectedEvent || '-'}</td>
            <td>${formatDate(booking.createdAt)}</td>
            <td>-</td>
            <td>${(booking.players || []).length || 0}</td>
            <td><span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="viewBooking('${booking.bookingId}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Load Bookings Page
async function loadBookingsPage(page = 1) {
    try {
        const params = {
            page: page,
            limit: 20,
            ...currentFilters
        };
        
        console.log('Loading bookings with params:', params);
        const response = await apiService.getBookings(params);
        console.log('Bookings response:', response);
        
        // Handle different response formats
        let bookings = [];
        let pagination = {};
        
        if (response) {
            // Try to get bookings array
            if (Array.isArray(response.data)) {
                bookings = response.data;
            } else if (Array.isArray(response)) {
                bookings = response;
            } else if (response.bookings && Array.isArray(response.bookings)) {
                bookings = response.bookings;
            }
            
            // Try to get pagination
            if (response.pagination) {
                pagination = response.pagination;
            }
        }
        
        console.log('Processed bookings:', bookings.length, 'items');
        
        // Update table
        const tbody = document.getElementById('bookingsTable');
        if (!tbody) {
            console.error('Bookings table not found');
            return;
        }
        
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="12" style="text-align: center;">ไม่มีข้อมูลการจอง</td></tr>';
            updatePagination({ page: 1, pages: 1 });
            return;
        }
        
        tbody.innerHTML = bookings.map(booking => `
            <tr>
                <td><input type="checkbox" value="${booking.bookingId}"></td>
                <td>${booking.bookingId}</td>
                <td>${booking.firstName} ${booking.lastName || ''}</td>
                <td>${booking.email}</td>
                <td>${booking.phone || '-'}</td>
                <td>${booking.selectedEvent || '-'}</td>
                <td>${formatDate(booking.checkIn)}</td>
                <td>-</td>
                <td>${(booking.players || []).length || 0}</td>
                <td>${booking.price ? formatCurrency(booking.price) : '-'}</td>
                <td><span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewBooking('${booking.bookingId}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
        // Update pagination
        updatePagination(pagination);
        
    } catch (error) {
        console.error('Failed to load bookings:', error);
        const tbody = document.getElementById('bookingsTable');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="12" style="text-align: center; color: red;">เกิดข้อผิดพลาด: ' + error.message + '</td></tr>';
        }
    }
}

// Update Pagination
function updatePagination(pagination) {
    const paginationEl = document.getElementById('bookingsPagination');
    if (!paginationEl) return;
    
    const { page = 1, pages = 1 } = pagination;
    let html = '';
    
    // Previous button
    html += `<button class="page-btn" ${page === 1 ? 'disabled' : ''} onclick="loadBookingsPage(${page - 1})">
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    // Page numbers
    for (let i = 1; i <= pages; i++) {
        if (i === 1 || i === pages || (i >= page - 2 && i <= page + 2)) {
            html += `<button class="page-btn ${i === page ? 'active' : ''}" onclick="loadBookingsPage(${i})">${i}</button>`;
        } else if (i === page - 3 || i === page + 3) {
            html += `<button class="page-btn" disabled>...</button>`;
        }
    }
    
    // Next button
    html += `<button class="page-btn" ${page === pages ? 'disabled' : ''} onclick="loadBookingsPage(${page + 1})">
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    paginationEl.innerHTML = html;
}

// Load Users Page (Admin Only)
async function loadUsersPage() {
    if (!apiService.isAdmin()) {
        showNotification('คุณไม่มีสิทธิ์เข้าถึงหน้านี้', 'error');
        return;
    }
    
    try {
        console.log('Loading users...');
        console.log('Loading users...');
        const response = await apiService.getUsers();
        console.log('Users response:', response);
        
        // Handle different response formats
        let users = [];
        if (response) {
            if (Array.isArray(response.data)) {
                users = response.data;
            } else if (Array.isArray(response)) {
                users = response;
            } else if (response.users && Array.isArray(response.users)) {
                users = response.users;
            }
        }
        
        console.log('Processed users:', users.length, 'items');
        
        const tbody = document.getElementById('usersTable');
        if (!tbody) {
            console.error('Users table not found');
            return;
        }
        
        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">ไม่มีข้อมูล User</td></tr>';
            return;
        }
        
        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td><span class="status-badge ${user.role === 'admin' ? 'completed' : 'confirmed'}">${user.role}</span></td>
                <td><span class="status-badge ${user.isActive ? 'confirmed' : 'cancelled'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${formatDate(user.lastLogin)}</td>
                <td>${formatDate(user.createdAt)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="editUser(${user.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="toggleUserActive(${user.id}, ${user.isActive})">
                            <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                        </button>
                        <button class="btn-icon danger" onclick="deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load users:', error);
        const tbody = document.getElementById('usersTable');
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; color: red;">เกิดข้อผิดพลาด: ' + error.message + '</td></tr>';
        }
    }
}

// View Booking
async function viewBooking(bookingId) {
    try {
        const response = await apiService.getBookingById(bookingId);
        
        let booking = null;
        if (response && response.data) {
            booking = response.data;
        } else if (response && response.bookingId) {
            booking = response;
        }
        
        if (!booking) {
            showNotification('ไม่พบข้อมูลการจอง', 'error');
            return;
        }
        
        currentBookingId = bookingId;
        
        const modalBody = document.getElementById('bookingModalBody');
        modalBody.innerHTML = `
            <div class="booking-detail">
                <h3>รายละเอียดการจอง #${booking.bookingId}</h3>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>ชื่อ:</label>
                        <span>${booking.firstName} ${booking.lastName || ''}</span>
                    </div>
                    <div class="detail-item">
                        <label>อีเมล:</label>
                        <span>${booking.email}</span>
                    </div>
                    <div class="detail-item">
                        <label>โทรศัพท์:</label>
                        <span>${booking.phone || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>ประเทศ:</label>
                        <span>${booking.country || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Event:</label>
                        <span>${booking.selectedEvent || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Package:</label>
                        <span>${booking.packageType || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Check-in:</label>
                        <span>${booking.checkIn || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>Check-out:</label>
                        <span>${booking.checkOut || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <label>จำนวนผู้เล่น:</label>
                        <span>${(booking.players || []).length} คน</span>
                    </div>
                    <div class="detail-item">
                        <label>สถานะ:</label>
                        <span class="status-badge ${booking.status}">${getStatusText(booking.status)}</span>
                    </div>
                </div>
                ${booking.players && booking.players.length > 0 ? `
                    <h4 style="margin-top: 20px; margin-bottom: 10px;">รายชื่อผู้เล่น:</h4>
                    <ul style="list-style: none; padding: 0;">
                        ${booking.players.map(p => `<li style="padding: 5px 0;">• ${p.name || 'N/A'}</li>`).join('')}
                    </ul>
                ` : ''}
            </div>
        `;
        
        // Set current status in select
        document.getElementById('bookingStatusSelect').value = booking.status;
        
        // Show modal
        document.getElementById('bookingModal').classList.add('active');
        
    } catch (error) {
        console.error('Failed to load booking details:', error);
        showNotification('ไม่สามารถโหลดรายละเอียดการจองได้: ' + error.message, 'error');
    }
}

// Update Booking Status
async function updateBookingStatus() {
    if (!currentBookingId) return;
    
    const newStatus = document.getElementById('bookingStatusSelect').value;
    
    try {
        await apiService.updateBookingStatus(currentBookingId, newStatus);
        showNotification('อัพเดทสถานะเรียบร้อยแล้ว', 'success');
        closeModal('bookingModal');
        
        // Reload data
        await loadBookingsPage(currentPage);
        await loadDashboardData();
        
    } catch (error) {
        console.error('Failed to update booking status:', error);
        showNotification('ไม่สามารถอัพเดทสถานะได้: ' + error.message, 'error');
    }
}

// Show Add User Modal
function showAddUserModal() {
    document.getElementById('userModalTitle').textContent = 'เพิ่ม User ใหม่';
    document.getElementById('userId').value = '';
    document.getElementById('userUsername').value = '';
    document.getElementById('userEmail').value = '';
    document.getElementById('userPassword').value = '';
    document.getElementById('userPassword').required = true;
    document.getElementById('userRole').value = 'staff';
    document.getElementById('userActive').checked = true;
    
    document.getElementById('userModal').classList.add('active');
}

// Edit User
async function editUser(userId) {
    try {
        const response = await apiService.getUserById(userId);
        
        let user = null;
        if (response && response.data) {
            user = response.data;
        } else if (response && response.id) {
            user = response;
        }
        
        if (!user) {
            showNotification('ไม่พบข้อมูล User', 'error');
            return;
        }
        
        document.getElementById('userModalTitle').textContent = 'แก้ไข User';
        document.getElementById('userId').value = user.id;
        document.getElementById('userUsername').value = user.username;
        document.getElementById('userUsername').disabled = true;
        document.getElementById('userEmail').value = user.email;
        document.getElementById('userPassword').value = '';
        document.getElementById('userPassword').required = false;
        document.getElementById('userRole').value = user.role;
        document.getElementById('userActive').checked = user.isActive;
        
        document.getElementById('userModal').classList.add('active');
        
    } catch (error) {
        console.error('Failed to load user:', error);
        showNotification('ไม่สามารถโหลดข้อมูล User ได้: ' + error.message, 'error');
    }
}

// Save User
async function saveUser() {
    const userId = document.getElementById('userId').value;
    const username = document.getElementById('userUsername').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const password = document.getElementById('userPassword').value;
    const role = document.getElementById('userRole').value;
    const isActive = document.getElementById('userActive').checked;
    
    if (!username || !email) {
        showNotification('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }
    
    if (!userId && !password) {
        showNotification('กรุณากรอกรหัสผ่าน', 'error');
        return;
    }
    
    try {
        const userData = { email, role, isActive };
        if (password) userData.password = password;
        
        if (userId) {
            // Update existing user
            await apiService.updateUser(userId, userData);
            showNotification('แก้ไข User เรียบร้อยแล้ว', 'success');
        } else {
            // Create new user
            await apiService.register({ username, ...userData });
            showNotification('เพิ่ม User เรียบร้อยแล้ว', 'success');
        }
        
        closeModal('userModal');
        await loadUsersPage();
        
    } catch (error) {
        console.error('Failed to save user:', error);
        showNotification(error.message || 'ไม่สามารถบันทึกข้อมูลได้', 'error');
    }
}

// Toggle User Active
async function toggleUserActive(userId, currentStatus) {
    const action = currentStatus ? 'ปิดใช้งาน' : 'เปิดใช้งาน';
    
    if (!confirm(`ต้องการ${action} User นี้หรือไม่?`)) return;
    
    try {
        await apiService.toggleUserActive(userId);
        showNotification(`${action}เรียบร้อยแล้ว`, 'success');
        await loadUsersPage();
    } catch (error) {
        console.error('Failed to toggle user:', error);
        showNotification('ไม่สามารถดำเนินการได้: ' + error.message, 'error');
    }
}

// Delete User
async function deleteUser(userId) {
    if (!confirm('ต้องการลบ User นี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) return;
    
    try {
        await apiService.deleteUser(userId);
        showNotification('ลบ User เรียบร้อยแล้ว', 'success');
        await loadUsersPage();
    } catch (error) {
        console.error('Failed to delete user:', error);
        showNotification(error.message || 'ไม่สามารถลบ User ได้', 'error');
    }
}

// Modals
function initModals() {
    const modals = document.querySelectorAll('.modal');
    
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    if (modalId === 'userModal') {
        document.getElementById('userUsername').disabled = false;
    }
}

// Filters
function initFilters() {
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    const gameFilter = document.getElementById('gameFilter');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            currentFilters.status = statusFilter.value;
            loadBookingsPage(1);
        });
    }
    
    if (dateFilter) {
        dateFilter.addEventListener('change', () => {
            currentFilters.date = dateFilter.value;
            loadBookingsPage(1);
        });
    }
    
    if (gameFilter) {
        gameFilter.addEventListener('change', () => {
            currentFilters.event = gameFilter.value;
            loadBookingsPage(1);
        });
    }
}

// Helper Functions
function formatDate(dateString) {
    if (!dateString) return '-';
    
    // If the date string is already in DD/MM/YYYY format, return as is
    if (typeof dateString === 'string' && dateString.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
        return dateString;
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

function getStatusText(status) {
    const statusMap = {
        'confirmed': 'ยืนยันแล้ว',
        'pending': 'รอยืนยัน',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
}

// UI Helpers
function showLoading() {
    // You can implement a loading overlay here
}

function hideLoading() {
    // Hide loading overlay
}

function showNotification(message, type = 'info') {
    // Simple notification using alert for now
    // You can implement a better notification system
    if (type === 'error') {
        alert('❌ ' + message);
    } else if (type === 'success') {
        alert('✅ ' + message);
    } else {
        alert('ℹ️ ' + message);
    }
}

// Select All Checkbox
document.addEventListener('DOMContentLoaded', function() {
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('#bookingsTable input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = this.checked;
            });
        });
    }
});

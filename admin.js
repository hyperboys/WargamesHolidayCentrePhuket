// Admin Dashboard JavaScript - Connected to Real API

// Global variables
let currentBookingId = null;
let currentPage = 1;
let currentFilters = {};
let revenueChart = null;
let gamesChart = null;
let currentEventImageFile = null;
let allEventsData = [];

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
    // Force admin panel to English only
    currentLang = 'en';
    localStorage.setItem('language', 'en');
    updatePageLanguage();
}

// Toggle Language
function toggleLanguage() {
    // Admin panel is English only
    setLanguage('en');
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
            case 'events':
                await loadEventsPage();
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

// Get full image URL (add backend URL if needed)
function getImageUrl(imagePath) {
    if (!imagePath) return null;
    
    // If already a data URL or full URL, return as is
    if (imagePath.startsWith('data:') || 
        imagePath.startsWith('http://') || 
        imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // If relative path, prepend backend base URL
    const baseUrl = apiService.baseURL.replace('/api', '');
    
    // Ensure path starts with /
    const cleanPath = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    
    const fullUrl = baseUrl + cleanPath;
    console.log('Image URL constructed:', { original: imagePath, full: fullUrl });
    
    return fullUrl;
}

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

function normalizeNotificationMessage(message) {
    if (typeof message !== 'string') {
        return String(message || '');
    }

    const exactMap = {
        'เกิดข้อผิดพลาดในการโหลดข้อมูล': 'Failed to load data.',
        'คุณไม่มีสิทธิ์เข้าถึงหน้านี้': 'You do not have permission to access this page.',
        'ไม่พบข้อมูลการจอง': 'Booking not found.',
        'อัพเดทสถานะเรียบร้อยแล้ว': 'Status updated successfully.',
        'ไม่พบข้อมูล User': 'User not found.',
        'กรุณากรอกข้อมูลให้ครบถ้วน': 'Please fill in all required fields.',
        'กรุณากรอกรหัสผ่าน': 'Please enter a password.',
        'แก้ไข User เรียบร้อยแล้ว': 'User updated successfully.',
        'เพิ่ม User เรียบร้อยแล้ว': 'User created successfully.',
        'ลบ User เรียบร้อยแล้ว': 'User deleted successfully.',
        'ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB': 'Image file size must be 5MB or less.',
        'รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น': 'Only JPG, PNG, and WebP files are supported.',
        'ไม่พบข้อมูล Event': 'Event not found.',
        'กรุณากรอกข้อมูลที่จำเป็น (ชื่อ EN, วันที่เริ่ม, วันที่สิ้นสุด)': 'Please fill in required fields (English title, start date, end date).',
        'กรุณากรอก Slug': 'Please enter a slug.',
        'แก้ไข Event เรียบร้อยแล้ว': 'Event updated successfully.',
        'เพิ่ม Event เรียบร้อยแล้ว': 'Event created successfully.',
        'ลบ Event เรียบร้อยแล้ว': 'Event deleted successfully.'
    };

    if (exactMap[message]) {
        return exactMap[message];
    }

    const prefixMap = [
        ['ไม่สามารถโหลดรายละเอียดการจองได้: ', 'Unable to load booking details: '],
        ['ไม่สามารถอัพเดทสถานะได้: ', 'Unable to update status: '],
        ['ไม่สามารถโหลดข้อมูล User ได้: ', 'Unable to load user data: '],
        ['ไม่สามารถดำเนินการได้: ', 'Operation failed: '],
        ['ไม่สามารถโหลดรายละเอียด Event ได้: ', 'Unable to load event details: '],
        ['ไม่สามารถโหลดข้อมูล Event ได้: ', 'Unable to load event data: '],
        ['ไม่สามารถบันทึก Event ได้: ', 'Unable to save event: '],
        ['ไม่สามารถลบ Event ได้: ', 'Unable to delete event: ']
    ];

    for (const [thaiPrefix, enPrefix] of prefixMap) {
        if (message.startsWith(thaiPrefix)) {
            return enPrefix + message.slice(thaiPrefix.length);
        }
    }

    return message;
}

function showNotification(message, type = 'info') {
    const normalizedMessage = normalizeNotificationMessage(message);
    const rootId = 'adminToastRoot';
    let root = document.getElementById(rootId);

    if (!root) {
        root = document.createElement('div');
        root.id = rootId;
        root.className = 'toast-root';
        document.body.appendChild(root);
    }

    const tone = ['success', 'error', 'info'].includes(type) ? type : 'info';
    const icon = tone === 'success' ? 'fa-circle-check' : tone === 'error' ? 'fa-circle-xmark' : 'fa-circle-info';
    const title = tone === 'success' ? 'Success' : tone === 'error' ? 'Error' : 'Info';

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${tone}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icon}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${escapeHtml(normalizedMessage)}</div>
        </div>
        <button class="toast-close" type="button" aria-label="Close notification">
            <i class="fas fa-xmark"></i>
        </button>
    `;

    const closeButton = toast.querySelector('.toast-close');
    const removeToast = () => {
        toast.classList.add('toast-leave');
        setTimeout(() => toast.remove(), 220);
    };

    closeButton.addEventListener('click', removeToast);
    root.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add('toast-enter');
    });

    setTimeout(removeToast, 4500);
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
    
    // Initialize Event Image Upload
    initEventImageUpload();
    
    // Initialize Event Filters
    initEventFilters();
});

// ==========================================
// EVENT MANAGEMENT
// ==========================================

// Initialize Image Upload
function initEventImageUpload() {
    const uploadArea = document.getElementById('imageUploadArea');
    const fileInput = document.getElementById('eventImageFile');
    
    if (!uploadArea || !fileInput) return;
    
    // Click to upload
    uploadArea.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-image')) return;
        fileInput.click();
    });
    
    // File selected
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleImageFile(file);
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageFile(file);
        }
    });
}

function handleImageFile(file) {
    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showNotification('ไฟล์รูปภาพต้องมีขนาดไม่เกิน 5MB', 'error');
        return;
    }
    
    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('รองรับเฉพาะไฟล์ JPG, PNG, WebP เท่านั้น', 'error');
        return;
    }
    
    currentEventImageFile = file;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        showImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
}

function showImagePreview(src) {
    const preview = document.getElementById('imagePreview');
    const previewImg = document.getElementById('imagePreviewImg');
    const placeholder = document.getElementById('imageUploadPlaceholder');
    
    if (!src) {
        console.warn('showImagePreview called with empty src');
        return;
    }
    
    console.log('Showing image preview:', src);
    
    // Create new image to test loading
    const testImg = new Image();
    testImg.crossOrigin = 'anonymous';
    testImg.onload = () => {
        previewImg.src = src;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    testImg.onerror = () => {
        console.error('Failed to preload image:', src);
        // Still try to show it - may work in img tag
        previewImg.src = src;
        preview.style.display = 'block';
        placeholder.style.display = 'none';
    };
    testImg.src = src;
}

function removeEventImage() {
    currentEventImageFile = null;
    const preview = document.getElementById('imagePreview');
    const placeholder = document.getElementById('imageUploadPlaceholder');
    const fileInput = document.getElementById('eventImageFile');
    const urlInput = document.getElementById('eventImageUrl');
    
    preview.style.display = 'none';
    placeholder.style.display = 'block';
    fileInput.value = '';
    if (urlInput) urlInput.value = '';
}

// Include/Highlights Management
function addIncludeRow(enValue = '', thValue = '') {
    const container = document.getElementById('includesContainer');
    const index = container.children.length;
    
    const row = document.createElement('div');
    row.className = 'include-row';
    row.innerHTML = `
        <input type="text" placeholder="Highlight (EN)" value="${escapeHtml(enValue)}" data-field="en">
        <input type="text" placeholder="Highlight (TH)" value="${escapeHtml(thValue)}" data-field="th">
        <button type="button" class="btn-remove-include" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(row);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getIncludesData() {
    const rows = document.querySelectorAll('#includesContainer .include-row');
    const includes = [];
    rows.forEach(row => {
        const en = row.querySelector('[data-field="en"]').value.trim();
        const th = row.querySelector('[data-field="th"]').value.trim();
        if (en || th) {
            includes.push({ en, th });
        }
    });
    return includes;
}

// Initialize Event Filters
function initEventFilters() {
    const searchFilter = document.getElementById('eventSearchFilter');
    
    if (searchFilter) {
        let debounceTimer;
        searchFilter.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => filterEventsTable(), 300);
        });
    }
    
    // Auto-generate slug from title EN
    const titleEn = document.getElementById('eventTitleEn');
    const slugInput = document.getElementById('eventSlug');
    if (titleEn && slugInput) {
        titleEn.addEventListener('input', () => {
            // Only auto-generate if slug is empty or user hasn't manually edited it
            if (!slugInput.dataset.manualEdit) {
                slugInput.value = titleEn.value
                    .toLowerCase()
                    .trim()
                    .replace(/[^a-z0-9\s-]/g, '')
                    .replace(/\s+/g, '-')
                    .replace(/-+/g, '-');
            }
        });
        slugInput.addEventListener('input', () => {
            slugInput.dataset.manualEdit = 'true';
        });
    }
}

// Filter by tab click
function filterEventsByTab(btn) {
    document.querySelectorAll('.events-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    filterEventsTable();
}

// Toggle between card and table view
function toggleEventsView(view) {
    const grid = document.getElementById('eventsGrid');
    const table = document.getElementById('eventsTableWrapper');
    const cardBtn = document.getElementById('viewCards');
    const tableBtn = document.getElementById('viewTable');
    
    if (view === 'cards') {
        grid.style.display = '';
        table.style.display = 'none';
        cardBtn.classList.add('active');
        tableBtn.classList.remove('active');
    } else {
        grid.style.display = 'none';
        table.style.display = '';
        cardBtn.classList.remove('active');
        tableBtn.classList.add('active');
    }
    localStorage.setItem('eventsView', view);
}

// Tab navigation for event form
function switchEventTab(btn) {
    const tabId = btn.dataset.tab;
    document.querySelectorAll('.form-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.form-tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tabId).classList.add('active');
    updateTabNavButtons();
}

function navigateTab(direction) {
    const tabs = [...document.querySelectorAll('.form-tab')];
    const activeIndex = tabs.findIndex(t => t.classList.contains('active'));
    const newIndex = activeIndex + direction;
    if (newIndex >= 0 && newIndex < tabs.length) {
        switchEventTab(tabs[newIndex]);
    }
}

function updateTabNavButtons() {
    const tabs = [...document.querySelectorAll('.form-tab')];
    const activeIndex = tabs.findIndex(t => t.classList.contains('active'));
    const prevBtn = document.getElementById('btnPrevTab');
    const nextBtn = document.getElementById('btnNextTab');
    const saveBtn = document.getElementById('btnSaveEvent');
    
    if (prevBtn) prevBtn.style.display = activeIndex > 0 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = activeIndex < tabs.length - 1 ? '' : 'none';
    if (saveBtn) saveBtn.style.display = activeIndex === tabs.length - 1 ? '' : 'none';
}

function filterEventsTable() {
    const activeTab = document.querySelector('.events-tab.active');
    const status = activeTab ? activeTab.dataset.filter : '';
    const search = document.getElementById('eventSearchFilter')?.value?.toLowerCase() || '';
    
    let filtered = allEventsData;
    
    if (status) {
        filtered = filtered.filter(e => e.status === status);
    }
    
    if (search) {
        filtered = filtered.filter(e => {
            const titleEn = (e.title?.en || e.titleEn || '').toLowerCase();
            const titleTh = (e.title?.th || e.titleTh || '').toLowerCase();
            const slug = (e.slug || '').toLowerCase();
            return titleEn.includes(search) || titleTh.includes(search) || slug.includes(search);
        });
    }
    
    renderEventsCards(filtered);
    renderEventsTable(filtered);
    
    // Show/hide empty state
    const emptyEl = document.getElementById('eventsEmpty');
    const gridEl = document.getElementById('eventsGrid');
    const tableEl = document.getElementById('eventsTableWrapper');
    
    if (filtered.length === 0 && allEventsData.length > 0) {
        // Filtered to nothing
        if (emptyEl) {
            emptyEl.style.display = 'flex';
            emptyEl.querySelector('h3').textContent = currentLang === 'th' ? 'ไม่พบ Event ที่ตรงกัน' : 'No matching events';
            emptyEl.querySelector('p').textContent = currentLang === 'th' ? 'ลองเปลี่ยนตัวกรองหรือค้นหาใหม่' : 'Try changing filters or search terms';
        }
    } else if (filtered.length === 0) {
        if (emptyEl) emptyEl.style.display = 'flex';
    } else {
        if (emptyEl) emptyEl.style.display = 'none';
    }
}

// Load Events Page
async function loadEventsPage() {
    try {
        console.log('Loading events...');
        
        // Show loading
        const loadingEl = document.getElementById('eventsLoading');
        if (loadingEl) loadingEl.style.display = '';
        
        const response = await apiService.getEvents();
        console.log('Events response:', response);
        
        let events = [];
        if (response) {
            if (Array.isArray(response.data)) {
                events = response.data;
            } else if (Array.isArray(response)) {
                events = response;
            } else if (response.events && Array.isArray(response.events)) {
                events = response.events;
            }
        }
        
        allEventsData = events;
        
        // Hide loading
        if (loadingEl) loadingEl.style.display = 'none';
        
        // Update stats
        updateEventStats(events);
        
        // Render both views
        renderEventsCards(events);
        renderEventsTable(events);
        
        // Restore saved view preference
        const savedView = localStorage.getItem('eventsView') || 'cards';
        toggleEventsView(savedView);
        
        // Show empty state if needed
        const emptyEl = document.getElementById('eventsEmpty');
        if (events.length === 0 && emptyEl) {
            emptyEl.style.display = 'flex';
        } else if (emptyEl) {
            emptyEl.style.display = 'none';
        }
        
    } catch (error) {
        console.error('Failed to load events:', error);
        const loadingEl = document.getElementById('eventsLoading');
        if (loadingEl) loadingEl.style.display = 'none';
        
        const gridEl = document.getElementById('eventsGrid');
        if (gridEl) {
            gridEl.innerHTML = `<div class="events-error"><i class="fas fa-exclamation-triangle"></i><p>เกิดข้อผิดพลาด: ${error.message}</p><button class="btn-primary" onclick="loadEventsPage()"><i class="fas fa-redo"></i> ลองใหม่</button></div>`;
        }
    }
}

// Update Event Stats
function updateEventStats(events) {
    const totalEl = document.getElementById('totalEventsCount');
    const activeEl = document.getElementById('activeEventsCount');
    const upcomingEl = document.getElementById('upcomingEventsCount');
    const pastEl = document.getElementById('pastEventsCount');
    const draftEl = document.getElementById('draftEventsCount');
    const headerCount = document.getElementById('eventsHeaderCount');
    
    const total = events.length;
    const active = events.filter(e => e.status === 'active').length;
    const upcoming = events.filter(e => e.status === 'upcoming').length;
    const past = events.filter(e => e.status === 'past').length;
    const draft = events.filter(e => e.status === 'draft').length;
    
    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = active;
    if (upcomingEl) upcomingEl.textContent = upcoming;
    if (pastEl) pastEl.textContent = past;
    if (draftEl) draftEl.textContent = draft;
    if (headerCount) headerCount.textContent = `${total} event${total !== 1 ? 's' : ''}`;
}

// Render Events as Cards
function renderEventsCards(events) {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    if (events.length === 0) {
        grid.innerHTML = '';
        return;
    }
    
    const lang = currentLang || 'en';
    
    grid.innerHTML = events.map(event => {
        const title = event.title?.[lang] || event.title?.en || event.titleEn || event.slug || '-';
        const dateEn = event.date?.en || '';
        const dateTh = event.date?.th || '';
        const dateDisplay = lang === 'th' ? (dateTh || dateEn) : (dateEn || dateTh);
        const startDate = event.startDate ? formatDate(event.startDate) : '';
        const endDate = event.endDate ? formatDate(event.endDate) : '';
        const dateStr = dateDisplay || (startDate && endDate ? `${startDate} - ${endDate}` : startDate || '-');
        
        const duration = event.duration?.[lang] || event.duration?.en || event.durationEn || '-';
        const players = event.players?.[lang] || event.players?.en || event.playersEn || '-';
        const price = event.price ? `$${event.price}` : '-';
        const status = event.status || 'draft';
        const imagePath = event.image || event.imageUrl || '';
        const imageUrl = getImageUrl(imagePath);
        const eventId = event._id || event.id;
        const rules = event.rules?.en || event.rules || '';
        
        const statusTextMap = {
            active: 'Active',
            upcoming: 'Upcoming',
            draft: 'Draft',
            past: 'Past'
        };
        
        const statusIconMap = {
            active: 'fas fa-check-circle',
            upcoming: 'fas fa-clock',
            draft: 'fas fa-pencil-alt',
            past: 'fas fa-history'
        };
        
        return `
            <div class="event-card" onclick="viewEvent('${eventId}')">
                <div class="event-card-image">
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${escapeHtml(title)}" crossorigin="anonymous" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'; console.error('Event card image failed:', '${imageUrl}');" onload="this.nextElementSibling.style.display='none';">`
                        : ''
                    }
                    <div class="event-card-no-image" ${imageUrl ? 'style="display:flex"' : ''}>
                        <i class="fas fa-chess-knight"></i>
                    </div>
                    <span class="event-card-status ${status}">
                        <i class="${statusIconMap[status] || 'fas fa-circle'}"></i>
                        ${statusTextMap[status] || status}
                    </span>
                </div>
                <div class="event-card-body">
                    <h3 class="event-card-title">${escapeHtml(title)}</h3>
                    ${rules ? `<div class="event-card-rules">${escapeHtml(rules)}</div>` : ''}
                    <div class="event-card-meta">
                        <div class="event-card-meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${dateStr}</span>
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${duration}</span>
                        </div>
                        <div class="event-card-meta-item">
                            <i class="fas fa-users"></i>
                            <span>${players}</span>
                        </div>
                    </div>
                </div>
                <div class="event-card-footer">
                    <div class="event-card-price">${price}<small>/day</small></div>
                    <div class="event-card-actions" onclick="event.stopPropagation()">
                        <button class="card-action-btn" onclick="editEvent('${eventId}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="card-action-btn danger" onclick="deleteEvent('${eventId}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Events Table
function renderEventsTable(events) {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;
    
    if (events.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">ไม่มีข้อมูล Event</td></tr>';
        return;
    }
    
    const lang = currentLang || 'en';
    
    tbody.innerHTML = events.map(event => {
        const title = event.title?.[lang] || event.title?.en || event.titleEn || event.slug || '-';
        const dateEn = event.date?.en || '';
        const dateTh = event.date?.th || '';
        const dateDisplay = lang === 'th' ? (dateTh || dateEn) : (dateEn || dateTh);
        const startDate = event.startDate ? formatDate(event.startDate) : '';
        const endDate = event.endDate ? formatDate(event.endDate) : '';
        const dateStr = dateDisplay || (startDate && endDate ? `${startDate} - ${endDate}` : startDate || '-');
        
        const duration = event.duration?.[lang] || event.duration?.en || event.durationEn || '-';
        const players = event.players?.[lang] || event.players?.en || event.playersEn || '-';
        const price = event.price ? `$${event.price}` : '-';
        const status = event.status || 'draft';
        const imagePath = event.image || event.imageUrl || '';
        const imageUrl = getImageUrl(imagePath);
        const eventId = event._id || event.id;
        
        const statusTextMap = {
            active: 'Active',
            upcoming: 'Upcoming',
            draft: 'Draft',
            past: 'Past'
        };
        
        return `
            <tr>
                <td>
                    ${imageUrl 
                        ? `<img src="${imageUrl}" alt="${title}" class="event-table-thumb" onerror="this.outerHTML='<div class=event-table-thumb-placeholder><i class=fas fa-image></i></div>'">`
                        : '<div class="event-table-thumb-placeholder"><i class="fas fa-image"></i></div>'
                    }
                </td>
                <td><strong>${escapeHtml(title)}</strong></td>
                <td>${dateStr}</td>
                <td>${duration}</td>
                <td>${players}</td>
                <td>${price}/day</td>
                <td><span class="status-badge ${status}">${statusTextMap[status] || status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="viewEvent('${eventId}')" title="View">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="editEvent('${eventId}')" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon danger" onclick="deleteEvent('${eventId}')" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// Show Add Event Modal
function showAddEventModal() {
    document.getElementById('eventModalTitle').textContent = currentLang === 'th' ? 'เพิ่ม Event ใหม่' : 'Add New Event';
    document.getElementById('eventId').value = '';
    document.getElementById('eventForm').reset();
    document.getElementById('includesContainer').innerHTML = '';
    removeEventImage();
    
    // Reset slug auto-generate
    const slugInput = document.getElementById('eventSlug');
    if (slugInput) delete slugInput.dataset.manualEdit;
    
    // Add 3 default include rows
    addIncludeRow('', '');
    addIncludeRow('', '');
    addIncludeRow('', '');
    
    // Reset to first tab
    const firstTab = document.querySelector('.form-tab');
    if (firstTab) switchEventTab(firstTab);
    
    document.getElementById('eventModal').classList.add('active');
}

// View Event Detail
async function viewEvent(eventId) {
    try {
        const response = await apiService.getEvent(eventId);
        const event = response?.data || response;
        
        if (!event) {
            showNotification('ไม่พบข้อมูล Event', 'error');
            return;
        }
        
        const lang = currentLang || 'en';
        const title = event.title?.[lang] || event.title?.en || event.titleEn || '-';
        const desc = event.description?.[lang] || event.description?.en || event.descEn || '-';
        const history = event.history?.[lang] || event.history?.en || event.historyEn || '';
        const dateDisplay = event.date?.[lang] || event.date?.en || '';
        const startDate = event.startDate ? formatDate(event.startDate) : '';
        const endDate = event.endDate ? formatDate(event.endDate) : '';
        const dateStr = dateDisplay || (startDate && endDate ? `${startDate} - ${endDate}` : startDate || '-');
        const duration = event.duration?.[lang] || event.duration?.en || '-';
        const players = event.players?.[lang] || event.players?.en || '-';
        const rules = event.rules?.[lang] || event.rules?.en || event.rules || '-';
        const price = event.price ? `$${event.price}/day` : '-';
        const status = event.status || 'draft';
        const imagePath = event.image || event.imageUrl || '';
        const imageUrl = getImageUrl(imagePath);
        const includes = event.includes || [];
        
        const statusColors = {
            active: 'background:rgba(16,185,129,0.9)',
            upcoming: 'background:rgba(37,99,235,0.9)',
            draft: 'background:rgba(100,116,139,0.9)',
            past: 'background:rgba(239,68,68,0.9)'
        };
        
        const body = document.getElementById('eventDetailBody');
        body.innerHTML = `
            ${imageUrl ? `
                <div class="event-detail-header">
                    <img src="${imageUrl}" alt="${title}" onerror="this.style.display='none'">
                    <div class="event-detail-overlay">
                        <h3>${escapeHtml(title)}</h3>
                        <span class="event-status-pill" style="${statusColors[status] || ''}; color:white;">${status.toUpperCase()}</span>
                    </div>
                </div>
            ` : `<h3 style="margin-bottom:16px;">${escapeHtml(title)} <span class="status-badge ${status}">${status}</span></h3>`}
            
            <div class="event-detail-info-grid">
                <div class="event-detail-info-item">
                    <i class="fas fa-calendar"></i>
                    <div>
                        <span class="info-label">Date</span>
                        <span class="info-value">${dateStr}</span>
                    </div>
                </div>
                <div class="event-detail-info-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <span class="info-label">Duration</span>
                        <span class="info-value">${duration}</span>
                    </div>
                </div>
                <div class="event-detail-info-item">
                    <i class="fas fa-users"></i>
                    <div>
                        <span class="info-label">Players</span>
                        <span class="info-value">${players}</span>
                    </div>
                </div>
                <div class="event-detail-info-item">
                    <i class="fas fa-dollar-sign"></i>
                    <div>
                        <span class="info-label">Price</span>
                        <span class="info-value">${price}</span>
                    </div>
                </div>
            </div>
            
            <div class="event-detail-section">
                <h4><i class="fas fa-info-circle"></i> About This Event</h4>
                <p>${desc}</p>
            </div>
            
            ${history ? `
                <div class="event-detail-section">
                    <h4><i class="fas fa-book"></i> Historical Background</h4>
                    <p>${history}</p>
                </div>
            ` : ''}
            
            <div class="event-detail-section">
                <h4><i class="fas fa-dice"></i> Game Rules</h4>
                <p>${rules}</p>
            </div>
            
            ${includes.length > 0 ? `
                <div class="event-detail-section">
                    <h4><i class="fas fa-star"></i> Highlights</h4>
                    <ul class="event-detail-includes">
                        ${includes.map(item => {
                            const text = item?.[lang] || item?.en || item || '';
                            return `<li><i class="fas fa-check-circle"></i> ${escapeHtml(text)}</li>`;
                        }).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
        
        // Setup edit button
        const editBtn = document.getElementById('editFromDetailBtn');
        editBtn.onclick = () => {
            closeModal('eventDetailModal');
            editEvent(eventId);
        };
        
        document.getElementById('eventDetailModal').classList.add('active');
        
    } catch (error) {
        console.error('Failed to load event details:', error);
        showNotification('ไม่สามารถโหลดรายละเอียด Event ได้: ' + error.message, 'error');
    }
}

// Edit Event
async function editEvent(eventId) {
    try {
        const response = await apiService.getEvent(eventId);
        const event = response?.data || response;
        
        if (!event) {
            showNotification('ไม่พบข้อมูล Event', 'error');
            return;
        }
        
        document.getElementById('eventModalTitle').textContent = currentLang === 'th' ? 'แก้ไข Event' : 'Edit Event';
        document.getElementById('eventId').value = event._id || event.id || '';
        document.getElementById('eventSlug').value = event.slug || '';
        document.getElementById('eventTitleEn').value = event.title?.en || event.titleEn || '';
        document.getElementById('eventTitleTh').value = event.title?.th || event.titleTh || '';
        document.getElementById('eventStartDate').value = event.startDate ? event.startDate.split('T')[0] : '';
        document.getElementById('eventEndDate').value = event.endDate ? event.endDate.split('T')[0] : '';
        document.getElementById('eventDurationEn').value = event.duration?.en || event.durationEn || '';
        document.getElementById('eventDurationTh').value = event.duration?.th || event.durationTh || '';
        document.getElementById('eventPlayersEn').value = event.players?.en || event.playersEn || '';
        document.getElementById('eventPlayersTh').value = event.players?.th || event.playersTh || '';
        document.getElementById('eventDescEn').value = event.description?.en || event.descEn || '';
        document.getElementById('eventDescTh').value = event.description?.th || event.descTh || '';
        document.getElementById('eventHistoryEn').value = event.history?.en || event.historyEn || '';
        document.getElementById('eventHistoryTh').value = event.history?.th || event.historyTh || '';
        document.getElementById('eventPrice').value = event.price || '';
        document.getElementById('eventRules').value = event.rules?.en || event.rules || '';
        document.getElementById('eventStatus').value = event.status || 'draft';
        document.getElementById('eventMaxCapacity').value = event.maxCapacity || '';
        
        // Show existing image
        const imagePath = event.image || event.imageUrl || '';
        if (imagePath) {
            const fullImageUrl = getImageUrl(imagePath);
            showImagePreview(fullImageUrl);
            document.getElementById('eventImageUrl').value = imagePath; // Store original path
        } else {
            removeEventImage();
        }
        
        // Load includes
        const container = document.getElementById('includesContainer');
        container.innerHTML = '';
        const includes = event.includes || [];
        if (includes.length > 0) {
            includes.forEach(item => {
                const en = item?.en || item || '';
                const th = item?.th || '';
                addIncludeRow(en, th);
            });
        } else {
            addIncludeRow('', '');
        }
        
        document.getElementById('eventModal').classList.add('active');
        
        // Reset to first tab
        const firstTab = document.querySelector('.form-tab');
        if (firstTab) switchEventTab(firstTab);
        
    } catch (error) {
        console.error('Failed to load event for editing:', error);
        showNotification('ไม่สามารถโหลดข้อมูล Event ได้: ' + error.message, 'error');
    }
}

// Save Event (Create or Update)
async function saveEvent() {
    const eventId = document.getElementById('eventId').value;
    const slug = document.getElementById('eventSlug').value.trim();
    const titleEn = document.getElementById('eventTitleEn').value.trim();
    const titleTh = document.getElementById('eventTitleTh').value.trim();
    const startDate = document.getElementById('eventStartDate').value;
    const endDate = document.getElementById('eventEndDate').value;
    
    // Validate required fields
    if (!titleEn || !startDate || !endDate) {
        showNotification('กรุณากรอกข้อมูลที่จำเป็น (ชื่อ EN, วันที่เริ่ม, วันที่สิ้นสุด)', 'error');
        return;
    }
    
    if (!slug) {
        showNotification('กรุณากรอก Slug', 'error');
        return;
    }
    
    // Build event data
    const eventData = {
        slug: slug,
        title: {
            en: titleEn,
            th: titleTh || titleEn
        },
        startDate: startDate,
        endDate: endDate,
        date: {
            en: document.getElementById('eventDurationEn').value ? formatEventDateDisplay(startDate, endDate, 'en') : '',
            th: document.getElementById('eventDurationTh').value ? formatEventDateDisplay(startDate, endDate, 'th') : ''
        },
        duration: {
            en: document.getElementById('eventDurationEn').value.trim(),
            th: document.getElementById('eventDurationTh').value.trim()
        },
        players: {
            en: document.getElementById('eventPlayersEn').value.trim(),
            th: document.getElementById('eventPlayersTh').value.trim()
        },
        description: {
            en: document.getElementById('eventDescEn').value.trim(),
            th: document.getElementById('eventDescTh').value.trim()
        },
        history: {
            en: document.getElementById('eventHistoryEn').value.trim(),
            th: document.getElementById('eventHistoryTh').value.trim()
        },
        price: parseFloat(document.getElementById('eventPrice').value) || 0,
        rules: document.getElementById('eventRules').value.trim(),
        status: document.getElementById('eventStatus').value,
        maxCapacity: parseInt(document.getElementById('eventMaxCapacity').value) || null,
        includes: getIncludesData()
    };
    
    // Handle image
    const imageUrl = document.getElementById('eventImageUrl').value.trim();
    if (imageUrl) {
        eventData.image = imageUrl;
    }
    
    try {
        // If there's a file to upload, use FormData
        if (currentEventImageFile) {
            const formData = new FormData();
            formData.append('image', currentEventImageFile);
            formData.append('eventData', JSON.stringify(eventData));
            
            if (eventId) {
                await apiService.updateEventWithImage(eventId, formData);
                showNotification('แก้ไข Event เรียบร้อยแล้ว', 'success');
            } else {
                await apiService.createEventWithImage(formData);
                showNotification('เพิ่ม Event เรียบร้อยแล้ว', 'success');
            }
        } else {
            if (eventId) {
                await apiService.updateEvent(eventId, eventData);
                showNotification('แก้ไข Event เรียบร้อยแล้ว', 'success');
            } else {
                await apiService.createEvent(eventData);
                showNotification('เพิ่ม Event เรียบร้อยแล้ว', 'success');
            }
        }
        
        closeModal('eventModal');
        currentEventImageFile = null;
        await loadEventsPage();
        
    } catch (error) {
        console.error('Failed to save event:', error);
        showNotification('ไม่สามารถบันทึก Event ได้: ' + error.message, 'error');
    }
}

// Delete Event
async function deleteEvent(eventId) {
    const confirmMsg = currentLang === 'th' 
        ? 'ต้องการลบ Event นี้หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้' 
        : 'Are you sure you want to delete this event? This action cannot be undone.';
    
    if (!confirm(confirmMsg)) return;
    
    try {
        await apiService.deleteEvent(eventId);
        showNotification('ลบ Event เรียบร้อยแล้ว', 'success');
        await loadEventsPage();
    } catch (error) {
        console.error('Failed to delete event:', error);
        showNotification('ไม่สามารถลบ Event ได้: ' + error.message, 'error');
    }
}

// Helper: Format event date for display
function formatEventDateDisplay(startDate, endDate, lang) {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const monthsEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthsTh = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    
    const months = lang === 'th' ? monthsTh : monthsEn;
    
    if (start.getMonth() === end.getMonth()) {
        return `${start.getDate()}-${end.getDate()} ${months[start.getMonth()]} ${start.getFullYear()}`;
    } else {
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
    }
}

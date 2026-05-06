// Global Application Logic & API Config

const API_BASE_URL = 'https://messmate-0foc.onrender.com/api';

// Fetch options wrapper for credentials (sessions)
const fetchOptions = (method = 'GET', body = null) => {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'omit' // We are removing express-session cookies because local file:// protocol doesn't support them well. We will use simple localStorage for auth instead to keep it beginner friendly.
    };
    
    // We will use a simple token or user object in localStorage to identify the user
    const user = JSON.parse(localStorage.getItem('messMateUser'));
    if (user && user.id) {
        options.headers['Authorization'] = `Bearer ${user.id}`;
    }

    if (body) {
        options.body = JSON.stringify(body);
    }
    return options;
};

// Authentication Check
function checkAuth() {
    const user = localStorage.getItem('messMateUser');
    const currentPath = window.location.pathname.split('/').pop();
    
    const publicPages = ['login.html', 'register.html', 'index.html', ''];
    
    if (!user && !publicPages.includes(currentPath)) {
        window.location.href = 'login.html';
    } else if (user && (currentPath === 'login.html' || currentPath === 'register.html')) {
        window.location.href = 'dashboard.html';
    }
}

// Theme Toggle Logic
function initTheme() {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            let newTheme = theme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcons(newTheme);
            
            // Dispatch event for charts to redraw
            window.dispatchEvent(new Event('themeChanged'));
        });
    });
}

function updateThemeIcons(theme) {
    const themeToggleBtns = document.querySelectorAll('.theme-toggle');
    themeToggleBtns.forEach(btn => {
        if (theme === 'dark') {
            btn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            btn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
        }
    });
}

// Sidebar Toggle Logic
function initSidebar() {
    const sidebarToggler = document.querySelector('.sidebar-toggler');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggler && sidebar) {
        sidebarToggler.addEventListener('click', () => {
            sidebar.classList.toggle('show');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(e.target) && 
                !sidebarToggler.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
}

// Toast Notification System
function showToast(message, type = 'success') {
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = `toast align-items-center text-bg-${type} border-0`;
    toastEl.setAttribute('role', 'alert');
    toastEl.setAttribute('aria-live', 'assertive');
    toastEl.setAttribute('aria-atomic', 'true');

    toastEl.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;

    toastContainer.appendChild(toastEl);
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();

    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });
}

// Set Active Sidebar Link
function setActiveSidebarLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// Auth Forms Logic
function initAuthForms() {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const errorDiv = document.getElementById('login-error');
            const btn = document.getElementById('login-btn');

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Logging in...';

            try {
                const res = await fetch(`${API_BASE_URL}/auth/login`, fetchOptions('POST', { email, password }));
                const data = await res.json();

                if (res.ok) {
                    localStorage.setItem('messMateUser', JSON.stringify(data.user));
                    window.location.href = 'dashboard.html';
                } else {
                    errorDiv.textContent = data.message;
                    errorDiv.classList.remove('d-none');
                }
            } catch (err) {
                errorDiv.textContent = 'Server error. Please make sure backend is running.';
                errorDiv.classList.remove('d-none');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Login';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value;
            const hostelBlock = document.getElementById('reg-block').value;
            const roomNumber = document.getElementById('reg-room').value;
            const password = document.getElementById('reg-password').value;
            const errorDiv = document.getElementById('register-error');
            const btn = document.getElementById('register-btn');

            btn.disabled = true;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Registering...';

            try {
                const res = await fetch(`${API_BASE_URL}/auth/register`, fetchOptions('POST', { name, email, hostelBlock, roomNumber, password }));
                const data = await res.json();

                if (res.ok) {
                    showToast('Registration successful! Please login.', 'success');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    errorDiv.textContent = data.message;
                    errorDiv.classList.remove('d-none');
                }
            } catch (err) {
                errorDiv.textContent = 'Server error. Please make sure backend is running.';
                errorDiv.classList.remove('d-none');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Register';
            }
        });
    }
}

function initLogout() {
    const logoutLinks = document.querySelectorAll('a[href="index.html"]');
    logoutLinks.forEach(link => {
        if(link.textContent.includes('Logout')) {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                await fetch(`${API_BASE_URL}/auth/logout`, fetchOptions('POST'));
                localStorage.removeItem('messMateUser');
                window.location.href = 'login.html';
            });
        }
    });
}

function loadUserProfile() {
    const userStr = localStorage.getItem('messMateUser');
    if (userStr) {
        const user = JSON.parse(userStr);
        document.querySelectorAll('.user-name-text').forEach(el => el.textContent = user.name);
        
        // Use an avatar API based on user name
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=ff6b6b&color=fff`;
        document.querySelectorAll('.user-avatar-img').forEach(img => img.src = avatarUrl);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initTheme();
    initSidebar();
    setActiveSidebarLink();
    initAuthForms();
    initLogout();
    loadUserProfile();
});

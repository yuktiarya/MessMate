// Global Application Logic & Initialization

const defaultData = {
    menu: {
        breakfast: [
            { id: 1, name: "Aloo Paratha", rating: 4.5, desc: "Served with chai and pickle." },
            { id: 2, name: "Poha", rating: 4.0, desc: "Light and healthy snack." }
        ],
        lunch: [
            { id: 3, name: "Rajma Chawal", rating: 4.8, desc: "Classic North Indian comfort food." },
            { id: 4, name: "Paneer Butter Masala", rating: 4.6, desc: "Served with Roti and rice." }
        ],
        dinner: [
            { id: 5, name: "Dal Makhani", rating: 4.7, desc: "Slow-cooked creamy lentils." },
            { id: 6, name: "Veg Biryani", rating: 4.9, desc: "Saturday special." }
        ]
    },
    feedbacks: [],
    complaints: [],
    polls: [
        {
            id: 1, question: "What should be Sunday's dinner?", options: [
                { id: 'opt1', text: 'Paneer Tikka', votes: 120 },
                { id: 'opt2', text: 'Chole Bhature', votes: 85 },
                { id: 'opt3', text: 'Veg Biryani', votes: 150 },
                { id: 'opt4', text: 'Pasta', votes: 45 }
            ]
        }
    ],
    user: {
        name: "Yukti Arya",
        hostal: "Sanskriti",
        room: "421",
        avatar: "https://ui-avatars.com/api/?name=Yukti+Arya&background=ff6b6b&color=fff"
    }
};

// Initialize LocalStorage if empty
function initMockData() {
    if (!localStorage.getItem('messMateData')) {
        localStorage.setItem('messMateData', JSON.stringify(defaultData));
    }
}

// Get data
function getAppStorage() {
    return JSON.parse(localStorage.getItem('messMateData')) || defaultData;
}

// Save data
function saveAppStorage(data) {
    localStorage.setItem('messMateData', JSON.stringify(data));
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

document.addEventListener('DOMContentLoaded', () => {
    initMockData();
    initTheme();
    initSidebar();
    setActiveSidebarLink();

    // Setup user profile images
    const userData = getAppStorage().user;
    document.querySelectorAll('.user-avatar-img').forEach(img => {
        img.src = userData.avatar;
    });
    document.querySelectorAll('.user-name-text').forEach(el => {
        el.textContent = userData.name;
    });
});

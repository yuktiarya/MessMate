// Menu Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', dateOptions);

    renderMenu();
});

async function renderMenu() {
    try {
        const res = await fetch(`${API_BASE_URL}/menu`, fetchOptions('GET'));
        const menuData = await res.json();

        // Helper to generate food card HTML
        const generateCard = (item) => `
            <div class="col-md-6 col-lg-4">
                <div class="card h-100 food-card">
                    <!-- Placeholder images from Unsplash based on food keywords -->
                    <img src="https://source.unsplash.com/400x300/?indian,food,${encodeURIComponent(item.name)}" class="card-img-top" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title fw-bold mb-0">${item.name}</h5>
                            <span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${item.rating || 4.0}</span>
                        </div>
                        <p class="card-text text-muted small">${item.desc}</p>
                    </div>
                </div>
            </div>
        `;

        const renderSection = (containerId, items) => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '';
                if (!items || items.length === 0) {
                    container.innerHTML = '<p class="text-muted p-3">No items uploaded yet.</p>';
                    return;
                }
                items.forEach(item => {
                    container.innerHTML += generateCard(item);
                });
            }
        };

        renderSection('breakfast-container', menuData.breakfast);
        renderSection('lunch-container', menuData.lunch);
        renderSection('dinner-container', menuData.dinner);

    } catch (error) {
        console.error('Error fetching menu:', error);
        document.querySelectorAll('.row.g-4').forEach(container => {
            if(container.id.includes('container')){
                container.innerHTML = '<p class="text-danger p-3">Failed to load menu from server.</p>';
            }
        });
    }
}

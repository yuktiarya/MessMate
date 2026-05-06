// Complaints Logic

document.addEventListener('DOMContentLoaded', () => {
    initComplaintForm();
    renderComplaints();
    initFilters();
});

let allComplaints = [];

function initComplaintForm() {
    const form = document.getElementById('complaint-form');
    if(!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('c-title').value;
        const category = document.getElementById('c-category').value;
        const description = document.getElementById('c-desc').value;
        const anonymous = document.getElementById('c-anonymous').checked;
        
        const btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Submitting...';

        try {
            const res = await fetch(`${API_BASE_URL}/complaints`, fetchOptions('POST', {
                title, description, category, anonymous
            }));
            const data = await res.json();

            if (res.ok) {
                showToast('Complaint filed successfully. We will look into it.', 'success');
                form.reset();
                renderComplaints(); // Refresh list
            } else {
                showToast(data.message || 'Failed to file complaint', 'danger');
            }
        } catch (error) {
            console.error(error);
            showToast('Server error. Please try again.', 'danger');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Submit Complaint';
        }
    });
}

async function renderComplaints(filterCat = 'All', searchTerm = '') {
    const listContainer = document.getElementById('complaints-list');
    if(!listContainer) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/complaints`, fetchOptions('GET'));
        allComplaints = await res.json();

        listContainer.innerHTML = '';
        
        let filtered = [...allComplaints];
        
        // Apply category filter
        if (filterCat !== 'All') {
            filtered = filtered.filter(c => c.category === filterCat);
        }
        
        // Apply search filter
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(c => 
                c.title.toLowerCase().includes(lowerTerm) || 
                c.description.toLowerCase().includes(lowerTerm)
            );
        }
        
        if (filtered.length === 0) {
            listContainer.innerHTML = `
                <div class="text-center text-muted p-5 border rounded bg-body">
                    <i class="bi bi-inbox fs-1"></i>
                    <p class="mt-2">No complaints found.</p>
                </div>
            `;
            return;
        }
        
        filtered.forEach(c => {
            let badgeColor = 'warning';
            if (c.status === 'Resolved') badgeColor = 'success';
            if (c.status === 'In Progress') badgeColor = 'primary';
            
            const html = `
                <div class="card border-0 shadow-sm">
                    <div class="card-body p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="fw-bold mb-0">${c.title}</h6>
                            <span class="badge bg-${badgeColor}">${c.status}</span>
                        </div>
                        <div class="mb-2">
                            <span class="badge bg-light text-dark border me-2">${c.category}</span>
                            <small class="text-muted"><i class="bi bi-clock me-1"></i>${new Date(c.createdAt).toLocaleDateString()}</small>
                            ${c.anonymous ? '<small class="text-muted ms-2"><i class="bi bi-incognito me-1"></i>Anonymous</small>' : ''}
                        </div>
                        <p class="mb-0 text-sm">${c.description}</p>
                    </div>
                </div>
            `;
            listContainer.innerHTML += html;
        });

    } catch (error) {
        console.error('Failed to fetch complaints', error);
        listContainer.innerHTML = '<p class="text-danger text-center">Failed to load complaints from server.</p>';
    }
}

function initFilters() {
    const categorySelect = document.getElementById('filter-category');
    const searchInput = document.getElementById('search-complaint');
    
    if(categorySelect && searchInput) {
        categorySelect.addEventListener('change', (e) => {
            renderComplaints(e.target.value, searchInput.value);
        });
        
        searchInput.addEventListener('input', (e) => {
            renderComplaints(categorySelect.value, e.target.value);
        });
    }
}

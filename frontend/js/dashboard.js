// Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
});

async function loadDashboardData() {
    try {
        // 1. Load Menu Snapshot
        const menuRes = await fetch(`${API_BASE_URL}/menu`, fetchOptions('GET'));
        const menuData = await menuRes.json();
        
        const menuContainer = document.getElementById('dashboard-menu-list');
        if (menuContainer && menuData) {
            menuContainer.innerHTML = '';
            const meals = ['breakfast', 'lunch', 'dinner'];
            
            meals.forEach(mealType => {
                const mealItems = menuData[mealType];
                if (mealItems && mealItems.length > 0) {
                    const item = mealItems[0]; // Just take the first item
                    
                    const mealIcon = mealType === 'breakfast' ? 'cup-hot' : mealType === 'lunch' ? 'brightness-high' : 'moon-stars';
                    const mealColor = mealType === 'breakfast' ? 'warning' : mealType === 'lunch' ? 'primary' : 'success';
                    
                    const html = `
                        <div class="d-flex align-items-center p-3 border rounded shadow-sm bg-body">
                            <div class="icon-box me-3 rounded bg-${mealColor}-subtle text-${mealColor} d-flex align-items-center justify-content-center" style="width: 45px; height: 45px; font-size: 1.2rem;">
                                <i class="bi bi-${mealIcon}"></i>
                            </div>
                            <div class="flex-grow-1">
                                <h6 class="mb-0 fw-bold">${item.name}</h6>
                                <small class="text-muted text-capitalize">${mealType}</small>
                            </div>
                            <div>
                                <span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${item.rating}</span>
                            </div>
                        </div>
                    `;
                    menuContainer.innerHTML += html;
                }
            });

            if (menuContainer.innerHTML === '') {
                menuContainer.innerHTML = '<p class="text-muted p-3">No menu data available yet.</p>';
            }
        }

        // 2. Load Recent Feedback Snapshot
        const fbRes = await fetch(`${API_BASE_URL}/feedback`, fetchOptions('GET'));
        const feedbacks = await fbRes.json();
        
        const feedbackContainer = document.getElementById('dashboard-feedback-list');
        if (feedbackContainer) {
            feedbackContainer.innerHTML = '';
            
            if (!feedbacks || feedbacks.length === 0) {
                feedbackContainer.innerHTML = `
                    <div class="text-center text-muted p-4">
                        <i class="bi bi-chat-square-text" style="font-size: 2rem;"></i>
                        <p class="mt-2">No recent feedback.</p>
                    </div>
                `;
            } else {
                // Show top 3 recent feedbacks
                const recent = feedbacks.slice(0, 3);
                recent.forEach(fb => {
                    const html = `
                        <div class="p-3 border rounded bg-body shadow-sm">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="badge bg-warning text-dark"><i class="bi bi-star-fill me-1"></i>${fb.tasteRating}</span>
                                <small class="text-muted">${new Date(fb.createdAt).toLocaleDateString()}</small>
                            </div>
                            <p class="mb-0 text-sm mt-2">"${fb.comment || 'No comment provided.'}"</p>
                        </div>
                    `;
                    feedbackContainer.innerHTML += html;
                });
            }
        }

        // 3. Update Stats via Analytics route
        const statRes = await fetch(`${API_BASE_URL}/analytics`, fetchOptions('GET'));
        const statData = await statRes.json();
        
        if (statData) {
            document.getElementById('stat-rating').textContent = statData.avgRating + '/5';
            document.getElementById('stat-feedback').textContent = statData.totalFeedbacks;
            document.getElementById('stat-complaints').textContent = statData.pendingComplaints;
        }

    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

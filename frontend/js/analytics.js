// Analytics Logic using Chart.js

document.addEventListener('DOMContentLoaded', () => {
    fetchAnalyticsAndInitCharts();

    // Redraw charts if theme changes to update text colors
    window.addEventListener('themeChanged', () => {
        // Just redraw the existing charts
        if (window.analyticsData) {
            initCharts(window.analyticsData);
        }
    });
});

let charts = [];

async function fetchAnalyticsAndInitCharts() {
    try {
        const res = await fetch(`${API_BASE_URL}/analytics`, fetchOptions('GET'));
        const data = await res.json();
        
        window.analyticsData = data; // Cache for theme changes
        initCharts(data);

    } catch (error) {
        console.error('Failed to load analytics', error);
    }
}

function initCharts(data) {
    if (!data) return;

    // Destroy existing charts to prevent overlap when re-rendering on theme change
    charts.forEach(chart => chart.destroy());
    charts = [];

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const textColor = isDark ? '#dcdde1' : '#636e72';
    const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

    Chart.defaults.color = textColor;
    Chart.defaults.font.family = "'Poppins', sans-serif";

    const commonOptions = {
        responsive: true,
        plugins: {
            legend: {
                labels: { color: textColor }
            }
        },
        scales: {
            x: { grid: { color: gridColor }, ticks: { color: textColor } },
            y: { grid: { color: gridColor }, ticks: { color: textColor } }
        }
    };

    // 1. Weekly Ratings (Line Chart) -> Using dummy history since we don't track historical dates deeply yet
    const ctxRatings = document.getElementById('ratingsChart');
    if(ctxRatings) {
        const ratingsChart = new Chart(ctxRatings.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Average Rating',
                    data: [3.8, 4.2, 4.0, 4.5, 3.9, 4.8, parseFloat(data.avgRating || 0)],
                    borderColor: '#ff6b6b',
                    backgroundColor: 'rgba(255, 107, 107, 0.2)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: commonOptions
        });
        charts.push(ratingsChart);
    }

    // 2. Mood Distribution (Doughnut Chart)
    const ctxMood = document.getElementById('moodChart');
    if(ctxMood && data.moodCounts) {
        const moodChart = new Chart(ctxMood.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['😍 Loved it', '🙂 Good', '😐 Average', '😖 Bad'],
                datasets: [{
                    data: [data.moodCounts.loved, data.moodCounts.good, data.moodCounts.average, data.moodCounts.bad],
                    backgroundColor: ['#1dd1a1', '#feca57', '#48dbfb', '#ff6b6b'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'bottom', labels: { color: textColor } }
                }
            }
        });
        charts.push(moodChart);
    }

    // 3. Complaints by Category (Bar Chart)
    const ctxComplaints = document.getElementById('complaintsChart');
    if(ctxComplaints && data.categoryCounts) {
        const complaintsChart = new Chart(ctxComplaints.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Hygiene', 'Food Quality', 'Quantity', 'Late Serving', 'Staff'],
                datasets: [{
                    label: 'No. of Complaints',
                    data: [
                        data.categoryCounts.hygiene, 
                        data.categoryCounts.quality, 
                        data.categoryCounts.quantity, 
                        data.categoryCounts.late, 
                        data.categoryCounts.staff
                    ],
                    backgroundColor: '#feca57',
                    borderRadius: 4
                }]
            },
            options: commonOptions
        });
        charts.push(complaintsChart);
    }

    // 4. Food Popularity (Bar Chart - Horizontal) -> Dummy data for foods to keep simple
    const ctxPopularity = document.getElementById('popularityChart');
    if(ctxPopularity) {
        const popularityChart = new Chart(ctxPopularity.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Chicken Biryani', 'Paneer Butter Masala', 'Aloo Paratha', 'Khichdi', 'Upma'],
                datasets: [{
                    label: 'Popularity Score',
                    data: [95, 88, 85, 40, 30],
                    backgroundColor: [
                        '#1dd1a1',
                        '#1dd1a1',
                        '#1dd1a1',
                        '#ff6b6b',
                        '#ff6b6b'
                    ],
                    borderRadius: 4
                }]
            },
            options: {
                ...commonOptions,
                indexAxis: 'y', // Makes it horizontal
            }
        });
        charts.push(popularityChart);
    }
}

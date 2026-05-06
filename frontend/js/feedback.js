// Feedback Form Logic

document.addEventListener('DOMContentLoaded', () => {
    initStarRating();
    initMoodSelector();
    initFormSubmit();
});

function initStarRating() {
    const stars = document.querySelectorAll('#star-rating i');
    const ratingInput = document.getElementById('rating-value');
    const ratingError = document.getElementById('rating-error');

    stars.forEach(star => {
        star.addEventListener('click', (e) => {
            const rating = parseInt(e.target.getAttribute('data-rating'));
            ratingInput.value = rating;
            ratingError.classList.add('d-none');
            
            // Update UI
            stars.forEach(s => {
                const r = parseInt(s.getAttribute('data-rating'));
                if (r <= rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

function initMoodSelector() {
    const moodBtns = document.querySelectorAll('.mood-btn');
    const moodInput = document.getElementById('mood-value');
    const moodError = document.getElementById('mood-error');

    moodBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            moodBtns.forEach(b => b.classList.remove('selected'));
            
            const currentBtn = e.target;
            currentBtn.classList.add('selected');
            
            moodInput.value = currentBtn.getAttribute('data-mood');
            moodError.classList.add('d-none');
        });
    });
}

function initFormSubmit() {
    const form = document.getElementById('feedback-form');
    
    if(!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const mealType = document.getElementById('meal-select').value;
        const tasteRating = parseInt(document.getElementById('rating-value').value);
        const mood = document.getElementById('mood-value').value;
        const comment = document.getElementById('comment-text').value;

        // Validation
        let isValid = true;
        if (tasteRating === 0) {
            document.getElementById('rating-error').classList.remove('d-none');
            isValid = false;
        }
        if (mood === "") {
            document.getElementById('mood-error').classList.remove('d-none');
            isValid = false;
        }

        if (isValid) {
            const btn = form.querySelector('button[type="submit"]');
            btn.disabled = true;
            btn.textContent = 'Submitting...';

            try {
                // To keep schema simple based on earlier, setting hygiene and quantity to tasteRating for now
                const payload = {
                    mealType,
                    tasteRating,
                    hygieneRating: tasteRating,
                    quantityRating: tasteRating,
                    mood,
                    comment
                };

                const res = await fetch(`${API_BASE_URL}/feedback`, fetchOptions('POST', payload));
                const data = await res.json();

                if (res.ok) {
                    showToast('Feedback submitted successfully! Thank you.', 'success');
                    
                    form.reset();
                    document.getElementById('rating-value').value = "0";
                    document.getElementById('mood-value').value = "";
                    document.querySelectorAll('#star-rating i').forEach(s => s.classList.remove('active'));
                    document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
                } else {
                    showToast(data.message || 'Failed to submit', 'danger');
                }
            } catch (error) {
                console.error(error);
                showToast('Server error. Please try again.', 'danger');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Submit Feedback';
            }
        }
    });
}

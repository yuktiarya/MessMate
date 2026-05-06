// Polls Logic

document.addEventListener('DOMContentLoaded', () => {
    renderPolls();
});

async function renderPolls() {
    const container = document.getElementById('polls-container');
    if(!container) return;
    
    try {
        const res = await fetch(`${API_BASE_URL}/polls`, fetchOptions('GET'));
        const polls = await res.json();

        container.innerHTML = '';
        
        if (!polls || polls.length === 0) {
            container.innerHTML = `
                <div class="text-center text-muted p-5 border rounded bg-body">
                    <i class="bi bi-bar-chart fs-1"></i>
                    <p class="mt-2">No active polls at the moment.</p>
                </div>
            `;
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('messMateUser'));
        const userId = user ? user.id : null;

        polls.forEach(poll => {
            // Check if user already voted in this poll
            const hasVoted = poll.voters.includes(userId);
            
            let totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
            if (totalVotes === 0) totalVotes = 1; // Prevent division by zero
            
            let optionsHtml = '';
            poll.options.forEach(opt => {
                const percentage = Math.round((opt.votes / totalVotes) * 100);
                
                // We won't know exactly which option the user voted for unless we change the schema, 
                // but we can just show results if they have voted.
                
                optionsHtml += `
                    <div class="poll-option border rounded p-3 mb-3" 
                         onclick="${hasVoted ? 'event.stopPropagation()' : `votePoll('${poll._id}', '${opt._id}')`}">
                        
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div class="d-flex align-items-center gap-2 fw-bold">
                                <i class="bi bi-circle text-muted"></i>
                                <span>${opt.text}</span>
                            </div>
                            <span class="text-muted small ${hasVoted ? '' : 'd-none'}">${percentage}% (${opt.votes} votes)</span>
                        </div>
                        
                        <div class="progress ${hasVoted ? '' : 'd-none'}">
                            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${percentage}%;" aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                    </div>
                `;
            });
            
            const html = `
                <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-transparent border-0 pt-4 pb-0">
                        <span class="badge bg-danger-subtle text-danger mb-2">Active Poll</span>
                        <h4 class="fw-bold">${poll.question}</h4>
                    </div>
                    <div class="card-body">
                        ${optionsHtml}
                        ${hasVoted ? '<p class="text-center text-success mt-3 mb-0 small"><i class="bi bi-check2-all me-1"></i>You have already voted in this poll.</p>' : ''}
                    </div>
                </div>
            `;
            
            container.innerHTML += html;
        });

    } catch (error) {
        console.error('Failed to load polls', error);
        container.innerHTML = '<p class="text-danger text-center">Failed to load polls from server.</p>';
    }
}

window.votePoll = async function(pollId, optionId) {
    try {
        const res = await fetch(`${API_BASE_URL}/polls/vote`, fetchOptions('POST', { pollId, optionId }));
        const data = await res.json();

        if (res.ok) {
            showToast('Vote recorded successfully!', 'success');
            renderPolls();
        } else {
            showToast(data.message || 'Failed to vote', 'danger');
        }
    } catch (error) {
        console.error(error);
        showToast('Server error. Please try again.', 'danger');
    }
};

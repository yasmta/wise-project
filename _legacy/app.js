// Main App Logic

document.addEventListener('DOMContentLoaded', () => {
    updateDate();
    setupScrollAnimations();

    // Initialize Gamification if on Retos page
    if (window.location.pathname.includes('retos.html')) {
        initGamification();
    }
});

/* --- General Utils --- */

function updateDate() {
    const dateElements = document.querySelectorAll('#last-update-date');
    const today = new Date().toLocaleDateString('es-ES', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    dateElements.forEach(el => el.textContent = today);
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .section h2, .hero-content').forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/* --- Gamification Logic --- */

let state = {
    points: 0,
    completedChallenges: [],
    badges: []
};

function initGamification() {
    // Load from LocalStorage
    const savedState = localStorage.getItem('wiseState');
    if (savedState) {
        state = JSON.parse(savedState);
    }

    updateUI();
    renderRanking();

    // Attach listeners to challenge cards
    document.querySelectorAll('.challenge-card').forEach(card => {
        const id = card.dataset.id;
        // Check if already completed
        if (state.completedChallenges.includes(id)) {
            card.classList.add('completed');
        }

        // Click event
        card.querySelector('.challenge-check').addEventListener('click', (e) => {
            e.stopPropagation(); // prevent double triggering if card has other clicks
            toggleChallenge(id, parseInt(card.dataset.points));
        });
    });
}

function toggleChallenge(id, points) {
    const card = document.querySelector(`.challenge-card[data-id="${id}"]`);

    if (state.completedChallenges.includes(id)) {
        // Toggle OFF (for demo purposes mostly, though usually challenges are one-off)
        // Let's allow untoggling
        state.completedChallenges = state.completedChallenges.filter(cid => cid !== id);
        state.points -= points;
        card.classList.remove('completed');
    } else {
        // Toggle ON
        state.completedChallenges.push(id);
        state.points += points;
        card.classList.add('completed');
    }

    saveState();
    updateUI();
}

function updateUI() {
    // Update Points
    const pointsDisplay = document.getElementById('total-points');
    if (pointsDisplay) pointsDisplay.textContent = state.points;

    // Update Progress (Max estimated points ~300 for demo)
    const maxPoints = 300;
    const percentage = Math.min((state.points / maxPoints) * 100, 100);
    const bar = document.getElementById('progress-bar');
    if (bar) bar.style.width = `${percentage}%`;

    // Check & Update Badges
    checkBadges();
}

function checkBadges() {
    // Define Badge Rules
    const rules = [
        { id: 'badge-novato', threshold: 10 },
        { id: 'badge-conocedor', threshold: 50 },
        { id: 'badge-activista', threshold: 100 },
        { id: 'badge-guardian', threshold: 200 }
    ];

    rules.forEach(rule => {
        const badgeEl = document.getElementById(rule.id);
        if (badgeEl) {
            if (state.points >= rule.threshold) {
                badgeEl.classList.add('unlocked');
                if (!state.badges.includes(rule.id)) {
                    state.badges.push(rule.id);
                }
            } else {
                badgeEl.classList.remove('unlocked');
            }
        }
    });

    saveState(); // Save badge state upgrades
}

function saveState() {
    localStorage.setItem('wiseState', JSON.stringify(state));
}

function resetProgress() {
    if (confirm('¿Seguro que quieres borrar tu progreso?')) {
        state = { points: 0, completedChallenges: [], badges: [] };
        localStorage.removeItem('wiseState');
        location.reload();
    }
}

/* --- Quiz Logic --- */

function checkAnswer(btn, isCorrect, feedback) {
    const parent = btn.parentElement;
    // Disable all buttons in this question
    const buttons = parent.querySelectorAll('.quiz-option');
    buttons.forEach(b => b.disabled = true);

    const feedbackEl = parent.querySelector('.feedback-msg');
    feedbackEl.style.display = 'block';
    feedbackEl.textContent = feedback;

    if (isCorrect) {
        btn.classList.add('correct');
        feedbackEl.style.color = 'var(--success)';
        addPoints(10); // Quiz points
    } else {
        btn.classList.add('incorrect');
        feedbackEl.style.color = 'var(--danger)';
    }
}

function addPoints(amount) {
    state.points += amount;
    saveState();
    updateUI();
}

/* --- Ranking Logic --- */

function saveScore() {
    const nameInput = document.getElementById('player-name');
    const name = nameInput.value.trim();

    if (!name) {
        alert('Por favor escribe tu nombre');
        return;
    }

    let leaderboard = JSON.parse(localStorage.getItem('wiseLeaderboard') || '[]');

    // Add current play
    leaderboard.push({ name: name, points: state.points });

    // Sort desc
    leaderboard.sort((a, b) => b.points - a.points);

    // Keep top 10
    leaderboard = leaderboard.slice(0, 10);

    localStorage.setItem('wiseLeaderboard', JSON.stringify(leaderboard));

    renderRanking();
    nameInput.value = '';
    alert('¡Puntuación guardada!');
}

function renderRanking() {
    const tbody = document.getElementById('ranking-body');
    if (!tbody) return;

    let leaderboard = JSON.parse(localStorage.getItem('wiseLeaderboard') || '[]');

    // Add dummy data if empty for demo
    if (leaderboard.length === 0) {
        leaderboard = [
            { name: "Yasmina (Demo)", points: 250 },
            { name: "Valeria (Demo)", points: 210 },
            { name: "Estudiante 1", points: 150 }
        ];
    }

    tbody.innerHTML = leaderboard.map((player, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${player.name}</td>
            <td>${player.points} pts</td>
        </tr>
    `).join('');
}

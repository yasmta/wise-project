
(async () => {
    try {
        console.log('Testing /api/challenges...');
        const res = await fetch('http://localhost:3001/api/challenges');
        console.log('Challenges Status:', res.status);
        if (res.status === 401 || res.status === 403) console.log('Auth working (protected)');

        console.log('Testing /api/quizzes...');
        const qRes = await fetch('http://localhost:3001/api/quizzes');
        console.log('Quizzes Status:', qRes.status);
    } catch (err) {
        console.error('Fetch failed:', err.message);
    }
})();

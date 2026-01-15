
const fs = require('fs');
const path = 'src/pages/Challenges.jsx';

const lines = fs.readFileSync(path, 'utf8').split('\n');

// Target lines 242 to 274 (1-based) => indices 241 to 273 (0-based)
// Verify start
console.log('Line 242:', lines[241]);
console.log('Line 274:', lines[273]);

if (lines[241].trim().startsWith('const handleSubmitQuiz') && lines[273].trim() === '};') {
    // Splice out
    lines.splice(241, 33); // Remove 33 lines
    fs.writeFileSync(path, lines.join('\n'), 'utf8');
    console.log('Successfully removed duplicated lines.');
} else {
    console.log('Verification failed, not editing.');
    console.log('Expected const handleSubmitQuiz, found:', lines[241]);
    console.log('Expected };, found:', lines[273]);
}

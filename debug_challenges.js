
import { getDb } from './server/database.js';
import fs from 'fs';

(async () => {
    try {
        const db = await getDb();
        const challenges = await db.all('SELECT * FROM challenges');
        fs.writeFileSync('challenges_dump.json', JSON.stringify(challenges, null, 2));
        console.log("Dumped to challenges_dump.json");
    } catch (err) {
        console.error(err);
    }
})();

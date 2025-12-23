import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbDir = path.join(__dirname, 'db');

if (!fs.existsSync(dbDir)) {
    console.error("Directory 'db' not found.");
    process.exit(1);
}

const files = fs.readdirSync(dbDir).filter(f => f.endsWith('.xlsx'));

console.log("Analyzing Excel files in ./db ...\n");

files.forEach(file => {
    const wb = XLSX.readFile(path.join(dbDir, file));
    const sheetName = wb.SheetNames[0];
    const sheet = wb.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    if (data.length > 0) {
        console.log(`--- ${file} ---`);
        console.log(`Columns:`, data[0]);
        console.log(`First row:`, data[1]);
        console.log('\n');
    }
});

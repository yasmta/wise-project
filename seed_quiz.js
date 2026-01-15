import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    try {
        const db = await open({
            filename: './server/db/database.sqlite',
            driver: sqlite3.Database
        });

        const questions = [
            {
                question: "¿Cuál es la función principal de la capa de ozono?",
                options: ["Bloquear rayos UV nocivos", "Calentar la Tierra", "Generar oxígeno"],
                answer: 0
            },
            {
                question: "¿Qué compuesto químico daña más la capa de ozono?",
                options: ["CO2", "CFCs", "Metano"],
                answer: 1
            },
            {
                question: "¿Qué podemos hacer para protegerla?",
                options: ["Usar más aire acondicionado", "Evitar aerosoles con CFC", "Quemar basura"],
                answer: 1
            }
        ];

        console.log("Inserting quiz...");
        await db.run(`INSERT INTO quizzes (title, description, questions, order_index) VALUES (?, ?, ?, ?)`,
            ['Quiz Semanal: Protección Solar', 'Demuestra lo que sabes sobre la capa de ozono. ¡Cada martes un nuevo reto!', JSON.stringify(questions), 1]
        );

        console.log('Quiz added successfully');
    } catch (err) {
        console.error('Error:', err);
    }
})();

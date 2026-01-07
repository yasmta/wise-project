import { getDb } from '../database.js';

const CHALLENGES = [
    // --- LILA / FÁCIL (Intro & Habits) ---
    {
        title: 'Quiz Semanal',
        description: 'Demuestra lo que sabes sobre la capa de ozono. ¡Cada martes un nuevo reto!',
        category: 'educacion',
        points: 15,
        level: 'easy',
        verification_type: 'quiz',
        periodicity: 'weekly',
        max_per_period: 1
    },
    {
        title: '7 Días Sin Aerosoles',
        description: 'Sustituye tus sprays por productos en barra, crema o roll-on durante una semana.',
        category: 'hogar',
        points: 30,
        level: 'easy',
        verification_type: 'auto',
        periodicity: 'weekly',
        max_per_period: 1
    },
    {
        title: 'Explorador de Datos',
        description: 'Lee el resumen del proyecto WISE en la sección de Información y responde qué aprendiste.',
        category: 'educacion',
        points: 20,
        level: 'easy',
        verification_type: 'link',
        periodicity: 'once',
        max_per_period: 1
    },
    {
        title: 'Compra Libre de CFC',
        description: 'Sube una foto de un tique de compra de productos de limpieza o higiene sin CFCs.',
        category: 'consumo',
        points: 20,
        level: 'easy',
        verification_type: 'photo',
        periodicity: 'weekly',
        max_per_period: 3
    },
    {
        title: 'Localiza tu Punto Limpio',
        description: 'Encuentra el punto limpio más cercano a tu casa y comparte su dirección en la comunidad.',
        category: 'consumo',
        points: 15,
        level: 'easy',
        verification_type: 'link',
        periodicity: 'once',
        max_per_period: 1
    },
    {
        title: 'Ducha de 5 Minutos',
        description: 'Reduce el tiempo de ducha para ahorrar agua y la energía de calentamiento (emisiones indirectas).',
        category: 'hogar',
        points: 10,
        level: 'easy',
        verification_type: 'auto',
        periodicity: 'daily',
        max_per_period: 7
    },

    // --- AZUL / MEDIO (Action & Community) ---
    {
        title: 'Embajador del Ozono',
        description: 'Comparte un artículo verificado sobre la recuperación del ozono en el foro de la Comunidad.',
        category: 'social',
        points: 50,
        level: 'medium',
        verification_type: 'link',
        periodicity: 'monthly',
        max_per_period: 2
    },
    {
        title: 'Inspector de Neveras',
        description: 'Limpia el polvo del serpentín trasero de tu nevera para que sea más eficiente y no sufra fugas.',
        category: 'hogar',
        points: 100,
        level: 'medium',
        verification_type: 'photo',
        periodicity: 'monthly',
        max_per_period: 1
    },
    {
        title: 'Transporte Multipodal',
        description: 'Usa transporte público, bici o camina durante 3 días seguidos. Sube foto de tu abono o ruta.',
        category: 'transporte',
        points: 40,
        level: 'medium',
        verification_type: 'photo',
        periodicity: 'weekly',
        max_per_period: 1
    },
    {
        title: 'Firma por el Clima',
        description: 'Busca una petición activa para la regulación de gases HFC y firma. Sube captura del correo de confirmación.',
        category: 'social',
        points: 50,
        level: 'medium',
        verification_type: 'photo',
        periodicity: 'monthly',
        max_per_period: 3
    },
    {
        title: 'Dieta Sin Metano',
        description: 'Día sin carne (especialmente ternera) para reducir las emisiones de NOx y N2O agrícolas.',
        category: 'consumo',
        points: 30,
        level: 'medium',
        verification_type: 'photo',
        periodicity: 'weekly',
        max_per_period: 2
    },
    {
        title: 'Consultor de Etiquetas',
        description: 'Revisa las etiquetas de eficiencia de los electrodomésticos de un vecino o familiar. Sube foto.',
        category: 'hogar',
        points: 45,
        level: 'medium',
        verification_type: 'photo',
        periodicity: 'monthly',
        max_per_period: 5
    },

    // --- GRIS / DIFÍCIL (Expert & Advocacy) ---
    {
        title: 'Voluntariado Activo',
        description: 'Participa en una campaña de recogida de residuos electrónicos o una charla ambiental presencial.',
        category: 'social',
        points: 300,
        level: 'hard',
        verification_type: 'photo',
        periodicity: 'year',
        max_per_period: 2
    },
    {
        title: 'Carta a la Industria',
        description: 'Escribe a una empresa de alimentación preguntando por su política de gases refrigerantes en transporte.',
        category: 'empresa',
        points: 150,
        level: 'hard',
        verification_type: 'link',
        periodicity: 'monthly',
        max_per_period: 1
    },
    {
        title: 'Plan de Sostenibilidad Laboral',
        description: 'Propón en tu trabajo o escuela una medida para reducir el uso de aire acondicionado o mejorar su mantenimiento.',
        category: 'empresa',
        points: 200,
        level: 'hard',
        verification_type: 'link',
        periodicity: 'once',
        max_per_period: 1
    },
    {
        title: 'Reciclaje de Gran Formato',
        description: 'Lleva una nevera o aire acondicionado antiguo (previo a 1995) a un punto verde certificado.',
        category: 'hogar',
        points: 250,
        level: 'hard',
        verification_type: 'photo',
        periodicity: 'once',
        max_per_period: 1
    },
    {
        title: 'Mentor del Ozono',
        description: 'Organiza una charla informativa de 10 minutos para amigos o familiares y sube una foto del grupo.',
        category: 'educacion',
        points: 100,
        level: 'hard',
        verification_type: 'photo',
        periodicity: 'monthly',
        max_per_period: 1
    }
];

async function seedChallenges() {
    try {
        const db = await getDb();
        console.log('Seeding extended challenges...');

        const stmt = await db.prepare(`
            INSERT INTO challenges (title, description, category, points, level, verification_type, periodicity, max_per_period)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        await db.run('DELETE FROM challenges');
        await db.run('DELETE FROM sqlite_sequence WHERE name="challenges"');

        for (const c of CHALLENGES) {
            await stmt.run(c.title, c.description, c.category, c.points, c.level, c.verification_type, c.periodicity, c.max_per_period);
        }

        await stmt.finalize();
        console.log('Extended challenges seeded.');
    } catch (err) {
        console.error('Error seeding challenges:', err);
    }
}

seedChallenges();

import { getDb } from '../database.js';

const BADGES = [
    // Learning
    {
        key: 'ozone_apprentice',
        name: 'Aprendiz del Ozono',
        description: 'Completar 3 quizzes semanales. Introducir conceptos básicos.',
        category: 'learning',
        icon: '/badges/1.png',
        criteria_type: 'quiz_count',
        criteria_value: 3
    },
    {
        key: 'stratospheric_sage',
        name: 'Sabio Estratosférico',
        description: 'Obtener ≥8/10 en 5 quizzes distintos. Consolidar conocimiento.',
        category: 'learning',
        icon: '/badges/2.png',
        criteria_type: 'quiz_high_score_count',
        criteria_value: 5
    },
    {
        key: 'air_chemist',
        name: 'Químico del Aire',
        description: 'Completar todos los módulos educativos. Comprender la química del ozono.',
        category: 'learning',
        icon: '/badges/3.png',
        criteria_type: 'module_complete_all',
        criteria_value: 1
    },
    // Home
    {
        key: 'cold_guardian',
        name: 'Guardián del Frío',
        description: 'Revisar o limpiar nevera/AC con prueba. Evitar fugas de refrigerantes.',
        category: 'home',
        icon: '/badges/4.png',
        criteria_type: 'action_clean_fridge',
        criteria_value: 1
    },
    {
        key: 'cfc_hunter',
        name: 'Cazador de CFCs',
        description: 'Reciclar ≥2 aparatos refrigerantes. Reducir emisiones directas.',
        category: 'home',
        icon: '/badges/5.png',
        criteria_type: 'action_recycle_appliance',
        criteria_value: 2
    },
    {
        key: 'bye_dinosaurs',
        name: 'Adiós a los Dinosaurios',
        description: 'No usar electrodomésticos anteriores a 1995. Eliminar fuentes de CFC.',
        category: 'home',
        icon: '/badges/6.png',
        criteria_type: 'action_no_old_appliances',
        criteria_value: 1
    },
    {
        key: 'responsible_home',
        name: 'Hogar Responsable',
        description: 'Completar 3 acciones de hogar distintas. Enfoque integral doméstico.',
        category: 'home',
        icon: '/badges/7.png',
        criteria_type: 'action_home_general',
        criteria_value: 3
    },
    // Habits
    {
        key: 'conscious_traveler',
        name: 'Viajero Consciente',
        description: 'Reducir uso del coche 3 meses. Disminuir NOx indirecto.',
        category: 'habits',
        icon: '/badges/8.png',
        criteria_type: 'action_reduce_car_months',
        criteria_value: 3
    },
    {
        key: 'soil_ally',
        name: 'Aliado del Suelo',
        description: 'Reducir consumo de carne 3 meses seguidos. Menor emisión de N₂O.',
        category: 'habits',
        icon: '/badges/9.png',
        criteria_type: 'action_reduce_meat_months',
        criteria_value: 3
    },
    {
        key: 'light_footprint',
        name: 'Huella Ligera',
        description: 'Acciones indirectas durante 6 meses. Constancia ambiental.',
        category: 'habits',
        icon: '/badges/10.png',
        criteria_type: 'action_indirect_months',
        criteria_value: 6
    },
    // Community
    {
        key: 'uv_educator',
        name: 'Educador UV',
        description: 'Compartir 3 artículos verificados. Divulgación científica.',
        category: 'community',
        icon: '/badges/11.png',
        criteria_type: 'action_share_article',
        criteria_value: 3
    },
    {
        key: 'science_communicator',
        name: 'Divulgador Científico',
        description: 'Publicar reseñas aceptadas. Crear contenido propio.',
        category: 'community',
        icon: '/badges/12.png',
        criteria_type: 'action_publish_review',
        criteria_value: 5 // Assuming X=5
    },
    {
        key: 'ozone_influencer',
        name: 'Influencer del Ozono',
        description: '1 artículo + 10 reseñas. Alcance social.',
        category: 'community',
        icon: '/badges/13.png',
        criteria_type: 'action_influence_combo',
        criteria_value: 1
    },
    // Action
    {
        key: 'active_citizen',
        name: 'Ciudadano Activo',
        description: 'Firmar 3 peticiones ambientales. Impulso normativo.',
        category: 'action',
        icon: '/badges/14.png',
        criteria_type: 'action_sign_petition',
        criteria_value: 3
    },
    {
        key: 'hands_for_ozone',
        name: 'Manos por el Ozono',
        description: 'Participar en voluntariado ambiental. Impacto real.',
        category: 'action',
        icon: '/badges/15.png',
        criteria_type: 'action_volunteer',
        criteria_value: 1
    },
    // Company
    {
        key: 'conscious_company',
        name: 'Empresa Consciente',
        description: 'Crear perfil + compromiso público. Responsabilidad corporativa.',
        category: 'company',
        icon: '/badges/16.png',
        criteria_type: 'action_create_company_profile',
        criteria_value: 1
    },
    {
        key: 'cfc_free_industry',
        name: 'Industria Sin CFC',
        description: 'Eliminar sustancias dañinas. Impacto estructural.',
        category: 'company',
        icon: '/badges/17.png',
        criteria_type: 'action_industry_clean',
        criteria_value: 1
    },
    // Special
    {
        key: 'atmospheric_constancy',
        name: 'Constancia Atmosférica',
        description: 'Actividad continua X semanas. Premiar perseverancia.',
        category: 'special',
        icon: '/badges/18.png',
        criteria_type: 'streak_weeks',
        criteria_value: 4 // Assuming X=4
    },
    {
        key: 'balance_defender',
        name: 'Defensor del Equilibrio',
        description: 'Acciones en todas las categorías. Visión global.',
        category: 'special',
        icon: '/badges/19.png',
        criteria_type: 'category_mastery_all',
        criteria_value: 1
    },
    {
        key: 'ozone_guardian_master',
        name: 'Guardián del Ozono',
        description: 'Nivel máximo + varias insignias clave. Insignia final.',
        category: 'special',
        icon: '/badges/20.png',
        criteria_type: 'level_max_mastery',
        criteria_value: 1
    },
    {
        name: "Persona Activa",
        description: "Participante destacado en la comunidad compartiendo artículos y reseñas.",
        icon: "/badges/21.png", // Assuming we might add one or just use 21
        criteria_type: "forum_contributions",
        criteria_value: 5,
        category: "Social"
    }
];

async function seedBadges() {
    try {
        const db = await getDb();
        console.log('Seeding badges...');

        const stmt = await db.prepare(`
            INSERT INTO badges (key, name, description, category, icon, criteria_type, criteria_value)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET
                name = excluded.name,
                description = excluded.description,
                category = excluded.category,
                icon = excluded.icon,
                criteria_type = excluded.criteria_type,
                criteria_value = excluded.criteria_value
        `);

        for (const badge of BADGES) {
            await stmt.run(
                badge.key,
                badge.name,
                badge.description,
                badge.category,
                badge.icon,
                badge.criteria_type,
                badge.criteria_value
            );
        }

        await stmt.finalize();
        console.log(`Seeded ${BADGES.length} badges successfully.`);
    } catch (err) {
        console.error('Error seeding badges:', err);
    }
}

seedBadges();

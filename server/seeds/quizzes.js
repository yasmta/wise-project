import { getDb } from '../database.js';

const QUIZZES = [
    {
        order_index: 1,
        title: 'Introducción a la Capa de Ozono',
        description: '¿Qué es y por qué es vital para la vida en la Tierra?',
        questions: [
            { question: '¿En qué capa de la atmósfera se encuentra principalmente el ozono?', options: ['Troposfera', 'Estratosfera', 'Mesosfera', 'Termosfera'], answer: 1 },
            { question: '¿Qué tipo de radiación bloquea principalmente la capa de ozono?', options: ['Infrarroja', 'Microondas', 'Ultravioleta (UV)', 'Rayos X'], answer: 2 },
            { question: '¿Cuál es la fórmula química del ozono?', options: ['O2', 'O3', 'CO2', 'H2O'], answer: 1 }
        ]
    },
    {
        order_index: 2,
        title: 'Los Villanos: CFCs y HFCs',
        description: 'Conoce los gases que dañan nuestra protección celestial.',
        questions: [
            { question: '¿Qué significan las siglas CFC?', options: ['Carbono Flour Cloro', 'Clorofluorocarbonos', 'Cloro Ferro Carbono', 'Capa Fría de Carbono'], answer: 1 },
            { question: '¿En qué aparatos eran comunes los CFCs?', options: ['Neveras y aerosoles', 'Televisores', 'Bicicletas', 'Bombillas'], answer: 0 },
            { question: '¿Los HFCs dañan la capa de ozono tanto como los CFCs?', options: ['Sí, igual', 'No, pero son potentes gases de efecto invernadero', 'No dañan nada', 'Son beneficiosos'], answer: 1 }
        ]
    },
    {
        order_index: 3,
        title: 'El Agujero de Ozono',
        description: 'Detección y evolución del fenómeno en los polos.',
        questions: [
            { question: '¿Sobre qué continente se detectó el primer "agujero" de ozono?', options: ['África', 'Europa', 'Antártida', 'Asia'], answer: 2 },
            { question: '¿En qué estación del año es más notable el agujero en la Antártida?', options: ['Invierno', 'Primavera', 'Verano', 'Otoño'], answer: 1 },
            { question: '¿El agujero de ozono es un hueco vacío de aire?', options: ['Sí', 'No, es una zona con concentración muy baja de ozono', 'Es una tormenta gigante', 'Es un reflejo solar'], answer: 1 }
        ]
    },
    {
        order_index: 4,
        title: 'Protocolo de Montreal',
        description: 'El acuerdo internacional más exitoso de la historia.',
        questions: [
            { question: '¿En qué año se firmó el Protocolo de Montreal?', options: ['1975', '1987', '1995', '2005'], answer: 1 },
            { question: '¿Cuál es el objetivo principal del Protocolo?', options: ['Reducir el plástico', 'Eliminar sustancias que agotan la capa de ozono', 'Plantar árboles', 'Limpiar los océanos'], answer: 1 },
            { question: '¿Ha tenido éxito el protocolo?', options: ['No', 'A medias', 'Sí, es un ejemplo de cooperación global', 'Empeoró las cosas'], answer: 2 }
        ]
    },
    {
        order_index: 5,
        title: 'Efectos en la Salud',
        description: '¿Cómo nos afecta la pérdida de ozono?',
        questions: [
            { question: '¿Qué problema ocular puede causar el exceso de UV?', options: ['Miopía', 'Cataratas', 'Daltonismo', 'Conjuntivitis'], answer: 1 },
            { question: '¿Qué órgano humano es más vulnerable a la radiación UV?', options: ['Corazón', 'Pulmones', 'Piel', 'Hígado'], answer: 2 },
            { question: '¿Afecta la radiación UV al sistema inmunológico?', options: ['No', 'Solo a las plantas', 'Sí, puede debilitarlo', 'Lo fortalece'], answer: 2 }
        ]
    },
    {
        order_index: 6,
        title: 'Ecosistemas y Radiación',
        description: 'Más allá de los humanos: plantas y animales.',
        questions: [
            { question: '¿Cómo afecta el UV al fitoplancton marino?', options: ['Lo hace crecer más', 'No le afecta', 'Reduce su población y afecta la cadena alimentaria', 'Cambia su color'], answer: 2 },
            { question: '¿Las plantas se ven afectadas por el UV?', options: ['No', 'Sí, puede alterar su crecimiento y desarrollo', 'Solo si no llueve', 'Crecen más rápido'], answer: 1 },
            { question: '¿Qué animales sufren más por el UV?', options: ['Animales nocturnos', 'Animales marinos superficiales y anfibios', 'Aves de rapiña', 'Insectos subterráneos'], answer: 1 }
        ]
    },
    {
        order_index: 7,
        title: 'Recuperación del Cielo',
        description: '¿Cuándo volverá el ozono a la normalidad?',
        questions: [
            { question: '¿Para qué año se espera que el ozono vuelva a niveles de 1980 en la mayor parte del mundo?', options: ['2030', '2040', '2060', '2100'], answer: 1 },
            { question: '¿Y en la Antártida?', options: ['2040', '2066', '2120', 'Nunca'], answer: 1 },
            { question: '¿Qué factor puede retrasar la recuperación?', options: ['Incendios forestales masivos y erupciones volcánicas', 'Uso de internet', 'Exceso de oxígeno', 'Viajes espaciales'], answer: 0 }
        ]
    },
    {
        order_index: 8,
        title: 'Gases Nitrosos (N2O)',
        description: 'La nueva amenaza invisible para el ozono.',
        questions: [
            { question: '¿De dónde proviene principalmente el N2O emitido por humanos?', options: ['Coches eléctricos', 'Agricultura y fertilizantes', 'Fábricas de papel', 'Minería'], answer: 1 },
            { question: '¿Es el N2O el principal gas agotador de ozono emitido hoy?', options: ['Sí', 'No, son los CFCs aún', 'Es el vapor de agua', 'Es el helio'], answer: 0 },
            { question: '¿Es también un gas de efecto invernadero?', options: ['No', 'Un poco', 'Sí, muy potente', 'Enfría la Tierra'], answer: 2 }
        ]
    },
    {
        order_index: 9,
        title: 'Mantenimiento del Hogar',
        description: 'Acciones directas en tu cocina y salón.',
        questions: [
            { question: '¿Qué debemos hacer con una nevera vieja antes de tirarla?', options: ['Dejarla en la calle', 'Llevarla a un punto limpio para recuperar gases', 'Venderla como chatarra', 'Enterrarla'], answer: 1 },
            { question: '¿Por qué limpiar el polvo de la nevera ayuda?', options: ['Para que luzca bien', 'Para que no se rompa el motor y evitar fugas por sobreesfuerzo', 'Para gastar más luz', 'No ayuda en nada'], answer: 1 },
            { question: '¿Cómo saber si un spray es seguro?', options: ['Si es grande', 'Si pone "Ozone Friendly" o "Sin CFCs"', 'Si huele bien', 'Si es caro'], answer: 1 }
        ]
    },
    {
        order_index: 10,
        title: 'Héroe del Ozono: Grado Maestro',
        description: 'Prueba final para el experto Cadete Espacial.',
        questions: [
            { question: '¿Quiénes ganaron el Nobel por descubrir la amenaza de los CFCs?', options: ['Einstein y Curie', 'Molina, Rowland y Crutzen', 'Newton y Darwin', 'Nadie'], answer: 1 },
            { question: '¿Qué es la Enmienda de Kigali?', options: ['Un plan para Marte', 'Un acuerdo para reducir HFCs', 'Una ley de pesca', 'Un tratado de paz'], answer: 1 },
            { question: '¿Cuál es tu papel en la protección del ozono?', options: ['Ninguno', 'Solo de espectador', 'Informarme, actuar y difundir el mensaje', 'Esperar que el gobierno lo solucione todo'], answer: 2 }
        ]
    },
    {
        order_index: 11,
        title: 'Satélites y Vigilancia',
        description: '¿Cómo vigilamos el ozono desde el espacio?',
        questions: [
            { question: '¿Qué agencia espacial utiliza el instrumento OMI para medir ozono?', options: ['NASA', 'ESA', 'JAXA', 'Roscosmos'], answer: 0 },
            { question: '¿Qué unidad se usa para medir el espesor de la capa de ozono?', options: ['Metros', 'Kilómetros', 'Unidades Dobson (DU)', 'Pascales'], answer: 2 },
            { question: '¿Cuál es el valor medio normal en Unidades Dobson?', options: ['50 DU', '300 DU', '1000 DU', '10 DU'], answer: 1 }
        ]
    },
    {
        order_index: 12,
        title: 'Ozono y Calentamiento Global',
        description: 'Dos problemas distintos pero conectados.',
        questions: [
            { question: '¿El agujero de ozono es la causa principal del cambio climático?', options: ['Sí', 'No, pero interactúan entre sí', 'Solo en invierno', 'No tienen ninguna relación'], answer: 1 },
            { question: '¿Qué efecto tiene la recuperación del ozono en el clima del Hemisferio Sur?', options: ['Lo calienta más', 'Ayuda a estabilizar los patrones de viento (Jet Stream)', 'Produce más lluvia ácida', 'No tiene efecto'], answer: 1 },
            { question: '¿Son los CFCs gases de efecto invernadero?', options: ['No', 'Solo un poco', 'Sí, miles de veces más potentes que el CO2', 'Enfrían la atmósfera'], answer: 2 }
        ]
    },
    {
        order_index: 13,
        title: 'Mitos del Ozono',
        description: 'Desmintiendo leyendas urbanas ambientales.',
        questions: [
            { question: '¿Es cierto que los volcanes emiten más cloro que los humanos?', options: ['Sí', 'No, el cloro volcánico se disuelve en agua antes de llegar arriba', 'Solo los volcanes marinos', 'No emiten cloro'], answer: 1 },
            { question: '¿Podemos fabricar ozono y lanzarlo con aviones para "rellenar" el agujero?', options: ['Sí, es fácil', 'No, la energía necesaria sería inmensa y es inviable', 'Ya se está haciendo', 'Sería tóxico para los pájaros'], answer: 1 },
            { question: '¿El ozono en el suelo (smog) es el mismo que el de arriba?', options: ['Sí, pero en el suelo es un contaminante perjudicial', 'No, son moléculas distintas', 'Arriba es malo y abajo bueno', 'No hay ozono en el suelo'], answer: 0 }
        ]
    },
    {
        order_index: 14,
        title: 'Química Estratosférica',
        description: 'La ciencia detrás de la destrucción molecular.',
        questions: [
            { question: '¿Cuántas moléculas de ozono puede destruir un solo átomo de cloro?', options: ['Una', 'Diez', 'Cerca de 100,000', 'Un millón'], answer: 2 },
            { question: '¿Qué actúa como catalizador en la destrucción del ozono?', options: ['El sol', 'El nitrógeno', 'El cloro y el bromo', 'El oxígeno'], answer: 2 },
            { question: '¿Qué rompe las moléculas de CFC para liberar el cloro?', options: ['El calor', 'La radiación UV de alta energía', 'El viento', 'La lluvia'], answer: 1 }
        ]
    },
    {
        order_index: 15,
        title: 'Acción Ciudadana 2.0',
        description: 'Liderando el cambio desde tu comunidad.',
        questions: [
            { question: '¿Qué etiqueta debes buscar en electrodomésticos nuevos?', options: ['Etiqueta roja', 'Eficiencia energética A+++ y libres de HFCs', 'Etiqueta de precio bajo', 'Hecho en plástico'], answer: 1 },
            { question: '¿Cuál es la mejor forma de difundir la causa?', options: ['Gritar en la calle', 'Compartir datos verificados y dar ejemplo', 'No decir nada', 'Pegar carteles'], answer: 1 },
            { question: '¿Es importante seguir revisando el aire acondicionado del coche?', options: ['No, es circuito cerrado', 'Sí, para evitar fugas de refrigerante al exterior', 'Solo si no enfría', 'Solo en verano'], answer: 1 }
        ]
    },
    {
        order_index: 16,
        title: 'Viajes Espaciales y Ozono',
        description: '¿Cómo afecta la nueva era espacial al cielo?',
        questions: [
            { question: '¿Qué emiten los cohetes que puede dañar el ozono localmente?', options: ['Vapor de agua y hollín en la estratosfera', 'Oxígeno puro', 'Solo calor', 'Luz brillante'], answer: 0 },
            { question: '¿Son los lanzamientos espaciales una amenaza mayor que los CFCs hoy?', options: ['Todavía no, pero se vigilan por su aumento', 'Sí, mucho más', 'No lanzan nada', 'Son beneficiosos'], answer: 0 },
            { question: '¿Qué cohetes son teóricamente más limpios?', options: ['Los de carbón', 'Los de hidrógeno líquido y oxígeno líquido', 'Los de pólvora', 'Los nucleares'], answer: 1 }
        ]
    },
    {
        order_index: 17,
        title: 'Volcanes y Fenómenos Naturales',
        description: 'Cuando la naturaleza pone a prueba la capa.',
        questions: [
            { question: '¿Qué inyectan las grandes erupciones en la estratosfera?', options: ['Ceniza pesada', 'Aerosoles de sulfato', 'Dióxido de carbono', 'Vapor'], answer: 1 },
            { question: '¿Cómo afectan los sulfatos al ozono?', options: ['Lo crean', 'No afectan', 'Aceleran las reacciones que lo destruyen', 'Lo protegen'], answer: 2 },
            { question: '¿Qué erupción reciente afectó al ozono?', options: ['Etna', 'Tonga (Hunga Tonga-Hunga Haapai)', 'Teide', 'Vesubio'], answer: 1 }
        ]
    },
    {
        order_index: 18,
        title: 'Legislación y Futuro',
        description: 'Las leyes sociales que protegen el mañana.',
        questions: [
            { question: '¿Qué país fue el primero en prohibir los CFCs en aerosoles?', options: ['España', 'EE.UU. y países escandinavos (1978)', 'China', 'Brasil'], answer: 1 },
            { question: '¿Existen multas por liberar gases refrigerantes?', options: ['No', 'Solo en invierno', 'Sí, está penado legalmente en muchos países', 'Solo si te ven'], answer: 2 },
            { question: '¿Qué pasaría sin el Protocolo de Montreal hoy?', options: ['Habría más árboles', 'El índice UV sería extremo en todo el mundo', 'Haría más frío', 'No cambiaría nada'], answer: 1 }
        ]
    },
    {
        order_index: 19,
        title: 'El Legado de Mario Molina',
        description: 'Homenaje al científico que nos salvó.',
        questions: [
            { question: '¿De qué país era originario Mario Molina?', options: ['España', 'México', 'Argentina', 'Chile'], answer: 1 },
            { question: '¿En qué año recibió el Nobel de Química?', options: ['1980', '1995', '2010', '2020'], answer: 1 },
            { question: '¿Qué predijo junto a Sherwood Rowland en 1974?', options: ['El fin del petróleo', 'Que los CFCs destruirían el ozono', 'La llegada de internet', 'El calentamiento de Marte'], answer: 1 }
        ]
    },
    {
        order_index: 20,
        title: 'Maestro Supremo del Universo',
        description: 'El examen definitivo para el Guardián del Cielo.',
        questions: [
            { question: '¿Cuál es la principal conclusión de esta misión?', options: ['Que todo está perdido', 'Que la acción colectiva y la ciencia pueden salvar el planeta', 'Que el ozono no importa', 'Que es mejor no comprar nada'], answer: 1 },
            { question: '¿Estás listo para ser un Embajador de WISE?', options: ['¡Sí, señor!', 'Tal vez', 'No sé qué es WISE', 'Más tarde'], answer: 0 },
            { question: '¿Seguirás protegiendo la capa de ozono cada día?', options: ['Solo los martes', '¡Por supuesto!', 'Si me pagan', 'Es mucho trabajo'], answer: 1 }
        ]
    }
];

async function seedQuizzes() {
    try {
        const db = await getDb();
        console.log('Seeding 20 quizzes...');

        await db.run('DELETE FROM quizzes');
        await db.run('DELETE FROM sqlite_sequence WHERE name="quizzes"');

        const stmt = await db.prepare(`
            INSERT INTO quizzes (title, description, questions, order_index)
            VALUES (?, ?, ?, ?)
        `);

        for (const q of QUIZZES) {
            await stmt.run(q.title, q.description, JSON.stringify(q.questions), q.order_index);
        }

        await stmt.finalize();
        console.log('20 Quizzes seeded successfully.');
    } catch (err) {
        console.error('Error seeding quizzes:', err);
    }
}

seedQuizzes();

import { Pathway, QuizQuestion } from '../types';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
    {
        id: 1,
        question: "Dans quel état d'esprit es-tu au réveil ?",
        options: [
            { text: "J'ai du mal à émerger, je me sens un peu \"dans le brouillard\".", target: 'BOOST' },
            { text: "Mon cerveau tourne déjà à 100 à l'heure, je me sens déjà sous pression.", target: 'RELAX' }
        ]
    },
    {
        id: 2,
        question: "Quel est ton objectif prioritaire pour les 4 prochains jours ?",
        options: [
            { text: "Augmenter ma productivité et ma vitalité.", target: 'BOOST' },
            { text: "Apprendre à lâcher prise et à mieux gérer mon stress.", target: 'RELAX' }
        ]
    },
    {
        id: 3,
        question: "Comment aimerais-tu te sentir juste après ta séance de coaching ?",
        options: [
            { text: "Invincible et prêt(e) à conquérir le monde.", target: 'BOOST' },
            { text: "Léger/Légère et profondément apaisé(e).", target: 'RELAX' }
        ]
    }
];

export const PATHWAYS: Record<'BOOST' | 'RELAX', Pathway> = {
    BOOST: {
        id: 'BOOST',
        name: 'BOOST',
        lessons: [
            {
                id: 'boost-j1',
                dayNumber: 1,
                title: "Réveil Articulaire",
                objective: "L'idée est de déverrouiller chaque articulation, de la nuque aux chevilles, pour signaler à ton système nerveux que la journée commence. Cela lubrifie tes articulations et prépare ton corps à bouger sans raideur.",
                thought: "Le mouvement est le carburant de ton cerveau.",
                youtubeId: "1stL_mZ3-X4"
            },
            {
                id: 'boost-j2',
                dayNumber: 2,
                title: "Cardio Flash",
                objective: "L'objectif est de créer un pic d'intensité court pour activer ton métabolisme et libérer des endorphines. Cette séance rapide stimule ta circulation sanguine pour une clarté mentale immédiate.",
                thought: "Ton corps est ton seul moteur, prends-en soin.",
                youtubeId: "ml6cT4AZdqI"
            },
            {
                id: 'boost-j3',
                dayNumber: 3,
                title: "Souffle Wim Hof",
                objective: "On travaille sur une oxygénation profonde des cellules. Cette technique de respiration permet de renforcer ton système immunitaire et d'améliorer ta résilience face au stress et aux imprévus de la journée.",
                thought: "L'oxygène est la clé du calme sous la pression.",
                youtubeId: "tybOi4hjZFQ"
            },
            {
                id: 'boost-j4',
                dayNumber: 4,
                title: "Yoga Tonique",
                objective: "On utilise des postures de force et d'équilibre pour renforcer ton gainage et ta posture. L'idée est de te sentir solide sur tes appuis et d'adopter une attitude de gagnant pour relever tes défis.",
                thought: "La discipline bat le talent quand il ne bouge pas.",
                youtubeId: "6hO_Y_N_zE0"
            }
        ]
    },
    RELAX: {
        id: 'RELAX',
        name: 'RELAX',
        lessons: [
            {
                id: 'relax-j1',
                dayNumber: 1,
                title: "Respiration Guidée",
                objective: "On utilise ici la cohérence cardiaque pour abaisser instantanément ton taux de cortisol (l'hormone du stress). En calmant ton souffle, tu reprends le contrôle sur ton mental et tu apaises ton système nerveux.",
                thought: "Le calme est un super-pouvoir, cultive-le.",
                youtubeId: "inpok4MKVLM"
            },
            {
                id: 'relax-j2',
                dayNumber: 2,
                title: "Instant Présent",
                objective: "Cette séance te guide pour ramener ton attention sur tes sensations physiques. L'idée est de sortir du mode \"pilote automatique\" et de stopper le flux incessant de tes pensées pour revenir ici et maintenant.",
                thought: "Arrête de courir, la vie se passe ici.",
                youtubeId: "ssss7V1_eyA"
            },
            {
                id: 'relax-j3',
                dayNumber: 3,
                title: "Libération Dos",
                objective: "L'idée est de relâcher les tensions accumulées dans les trapèzes et le bas du dos, souvent dues à la position assise. On cherche à redonner de l'espace à ta colonne vertébrale pour mieux respirer.",
                thought: "Prendre soin de son dos libère l'esprit.",
                youtubeId: "4C-gx_mUjFc"
            },
            {
                id: 'relax-j4',
                dayNumber: 4,
                title: "Sommeil Profond",
                objective: "Cette pratique de relaxation progressive prépare ton corps et ton cerveau au repos. On calme l'activité cérébrale pour faciliter l'endormissement et garantir une récupération totale pendant la nuit.",
                thought: "Le repos fait partie de la réussite.",
                youtubeId: "27Gub_2uXU8"
            }
        ]
    }
};

import { LookalikeChallenge } from './types';

export const QUIZ_LENGTH = 10;

export const LOOKALIKE_CHALLENGES: LookalikeChallenge[] = [
    {
        id: 'cottonmouth-watersnake',
        title: 'Cottonmouth vs Water Snake Challenge',
        description: 'Learn to distinguish between venomous Cottonmouths, Copperheads (Agkistrodon) and harmless Water Snakes (Nerodia)',
        species: [
            {
                common_name: 'Cottonmouths/Copperheads', 
                taxon_name: 'Agkistrodon sp.', 
                taxon_id: '30668'
            }, 
            {
                common_name: 'Water Snakes',
                taxon_name: 'Nerodia sp.', 
                taxon_id: '29299'
            }
        ], 
        region: {
            name: 'Southeastern United States', 
            place_ids: [21, 23, 43, 19, 37, 27, 18] // gulf states
        },
        difficulty: 'easy'
    },
    {
        id: 'tricolor-challenge',
        title: 'Florida Tricolor Challenge', 
        description: 'Master the art of identifying Coral Snakes, Scarlet Snakes, and Scarlet Kingsnakes',
        species: [
            {
                common_name: 'Coral Snake',
                taxon_name: 'Micrurus fulvius', 
                taxon_id: '73867'
            }, 
            {
                common_name: 'Scarlet Snake',
                taxon_name: 'Cemophora coccinea', 
                taxon_id: '27376'
            }, 
            {
                common_name: 'Scarlet Kingsnake',
                taxon_name: 'Lampropeltis elapsoides', 
                taxon_id: '29793'
            }
        ],
        region: {
            name: 'Florida',
            place_ids: [21]
        }
    }
];

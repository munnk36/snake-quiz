import { LookalikeChallenge } from './types';

// Geographic distribution data for cottonmouth species
// Based on known ranges: FL/AL/GA have all species, other gulf states have only northern
export const COTTONMOUTH_DISTRIBUTION: { [placeId: number]: string[] } = {
    21: ['904173', '904170', '914127'], // Florida - all species
    19: ['904173', '904170', '914127'], // Georgia - all species
    23: ['904173',], // Alabama
    43: ['904170'], // Texas
    37: ['904170'], // North Carolina
    27: ['904170'], // Mississippi
    18: ['904170'], // Arkansas
};

export const LOOKALIKE_CHALLENGES: LookalikeChallenge[] = [
    {
        id: 'cottonmouth-watersnake',
        title: 'Cottonmouth vs Water Snake Challenge',
        description: 'Learn to distinguish between venomous Cottonmouths and harmless Water Snakes (Copperheads excluded for focused learning)',
        species: [
            {
                common_name: 'Cottonmouths',
                taxon_name: 'Agkistrodon piscivorous & Agkistrodon conanti', 
                taxon_id: '30668', // This will be handled specially by getCottonwaterLookalikeQuizObservation
                venomous: true
            },
            {
                common_name: 'Watersnakes',
                taxon_name: 'Nerodia sp.', 
                taxon_id: '29299',
                venomous: false
            }
        ], 
        region: {
            name: 'Gulf Coast - United States', 
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
                taxon_id: '73867',
                venomous: true
            }, 
            {
                common_name: 'Scarlet Snake',
                taxon_name: 'Cemophora coccinea', 
                taxon_id: '27376',
                venomous: false
            }, 
            {
                common_name: 'Scarlet Kingsnake',
                taxon_name: 'Lampropeltis elapsoides', 
                taxon_id: '29793',
                venomous: false
            }
        ],
        region: {
            name: 'Florida, United States',
            place_ids: [21]
        }
    }
];

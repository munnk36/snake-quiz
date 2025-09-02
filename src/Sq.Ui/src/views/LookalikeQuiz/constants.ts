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
        title: 'Cottonmouth vs. Watersnake Challenge',
        description: 'Learn to distinguish between venomous Cottonmouths and harmless Water Snakes (Copperheads excluded for focused learning)',
        species: [
            {
                common_name: 'Cottonmouths',
                taxon_name: 'Agkistrodon piscivorous, Agkistrodon conanti', 
                taxon_id: '30668', // This will be handled specially by getCottonwaterLookalikeQuizObservation
                venomous: true
            },
            {
                common_name: 'Watersnakes',
                taxon_name: 'Nerodia spp.', 
                taxon_id: '29299',
                venomous: false
            }
        ], 
        region: {
            name: 'Gulf Coast - United States', 
            place_ids: [21, 23, 43, 19, 37, 27, 18] // gulf states
        },
        difficulty: 'medium',
        guide: `
What's similar: Both cottonmouths and watersnakes are semi-aquatic and often found in similar habitats, such as swamps and marshes. They both have similar stocky body shapes and sizes with a dark muddy-brown to black coloration and faint patterns.

Head Shape: Cottonmouths have broad, angular ridge along the top of their head, starting around the supraocular scale (directly above the eye) and running forward toward the snout. This ridge protrudes outward, partially overhanging the eyes giving the snake a grumpy-looking appearance.

Triangular Head?: Many people believe that a triangular head shape is a definitive characteristic of venomous snakes, including cottonmouths. However, this is not always the case, as some non-venomous snakes, including watersnakes, can flatten their heads to appear more triangular when threatened.

Cottonmouth Lips: Cottonmouths have white or cream colored horizontal stripes or lines that run from below the eye toward the corner of the mouth, and often another that runs from behind the top of the eye toward the point of the jaw.

Watersnake Lips: Watersnakes usually have dark, vertical stripes along the edges of their labial (lip) scales.

Eyes: Cottonmouths possess vertical, cat-like pupils, whereas watersnakes have big round googly-eye pupils. 

Cottonmouth Pattern: Cottonmouths and water snakes both darken with age, and the pattern is often obscured by the time they reach adulthood. When the pattern is visible, cottonmouths have bands that are usually wider at the bottom than on top; like pyramids in side view, or hourglasses from above. In some individuals, the bands might be broken or incomplete, so this is not 100% diagnostic, but is still useful when used in conjunction with the other keys.

Water Snake Pattern: Water snakes exhibit a wide variety of patterns; most species aren't banded at all, and the ones that are banded have bands that are wider at the top, like upside down triangles.

Swimming Behavior: When swimming, cottonmouths typically float with most of their body visible on the surface, appearing more buoyant. Watersnakes usually swim with only their head above water, keeping their body submerged.

Defensive Posturing: When threatened, cottonmouths will often gape their mouth wide open, revealing the distinctive white interior that gives them their common name. They may also vibrate their tail. Watersnakes typically flee quickly to water or may flatten their body and strike repeatedly.

Habitat Preferences: While both are semi-aquatic, cottonmouths prefer slower-moving waters like swamps, marshes, and ponds.

Range: Watersnakes are more commonly found in faster-flowing streams and rivers, though there is overlap in their preferred habitats. Watersnakes are found as far north as Canada and as far west as Colorado, whereas Cottonmouths are primarily located in the southeastern United States.`
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
            place_ids: [21],
        },
        difficulty: 'easy',
        guide: `
Color Band Patterns: You may know the classic rhyme, "Red touches yellow, kills a fellow; red touches black, friend of Jack." While this rhyme is generally true for North American coral snakes, it's important to remember that some individuals can exhibit variations in colors (absence of black or yellow entirely), and aberrant, broken patterns. It's important to observe many characteristics of the snake before making a positive identification. Furthermore, this rhyme only applies to a few North American species. Coral snakes in other parts of the world do not follow this rule.

Band Completeness: Both coral snakes and scarlet kingsnakes have bands that completely encircle the body, continuing across the belly. Scarlet scarlet snakes have mostly white bellies with incomplete red markings.

Head Coloration: Coral snakes have black heads with a yellow band behind it. Scarlet kingsnakes have red heads with black borders, while scarlet snakes have red heads that may lack distinct banding.

Head Shape: Coral snakes have small, rounded heads that are barely distinct from the neck. Both mimics have slightly more distinct heads, with scarlet kingsnakes having the most pronounced head. Scarlet snakes have narrow pointed heads.

Size and Build: Coral snakes are generally smaller and more slender with a more cylindrical body shape. Scarlet kingsnakes tend to be slightly larger and more robust.

Habitat and Behavior: Coral snakes are secretive and fossorial (underground-dwelling), rarely seen on the surface except after rains. Scarlet kingsnakes are more terrestrial and may be found under logs or rocks. Scarlet snakes are also fossorial but slightly more surface-active than coral snakes.

Geographic Range: While all three occur in Florida, their ranges vary. Coral snakes are found throughout most of Florida, scarlet kingsnakes prefer more northern and central areas, and scarlet snakes have a more limited distribution in northern Florida.
    `}
];

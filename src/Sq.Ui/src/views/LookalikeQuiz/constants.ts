import { LookalikeChallenge } from './types';

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
            name: 'Gulf Coast - United States'
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
            name: 'Florida, United States'
        },
        difficulty: 'easy',
        guide: `
Venom: Of the three snakes, only coral snakes are venomous elapids (related to cobras, mambas and kraits). Although bites are rare, they possess a neurotoxic venom that can be fatal to humans. Scarlet snakes and scarlet kingsnakes are non-venomous and pose no threat.

What's Similar: Coral snakes, scarlet snakes, and scarlet kingsnakes all exhibit similar vibrant colors that serve as warning signals (Aposematism) to potential predators.

Color Band Patterns: You may know the classic rhyme, "Red touches yellow, kills a fellow; red touches black, friend of Jack." While this rhyme is generally true for North American coral snakes, it's important to remember that some individuals can exhibit variations in colors (absence of black or yellow entirely), and aberrant, broken patterns. It's important to observe many characteristics of the snake before making a positive identification. Furthermore, this rhyme only applies to a few North American species. Coral snakes in other parts of the world do not follow this rule.

Band Completeness: Both coral snakes and scarlet kingsnakes have bands that completely encircle the body, continuing across the belly. Scarlet scarlet snakes have mostly white bellies with incomplete red markings.

Head Coloration: Coral snakes have black heads with a yellow band behind it. Scarlet kingsnakes have red heads with black borders, while scarlet snakes have red heads that may lack distinct banding.

Head Shape: Coral snakes have small, rounded heads that are barely distinct from the neck. Both mimics have slightly more distinct heads, with scarlet kingsnakes having the most pronounced head. Scarlet snakes have narrow pointed heads.

Size and Build: Coral snakes are generally smaller and more slender with a more cylindrical body shape. Scarlet kingsnakes tend to be slightly larger and more robust.

Habitat and Behavior: Coral snakes are secretive and fossorial (underground-dwelling), rarely seen on the surface except after rains. Scarlet kingsnakes are more terrestrial and may be found under logs or rocks. Scarlet snakes are also fossorial but slightly more surface-active than coral snakes.

Geographic Range: While all three occur in Florida, their ranges vary. Coral snakes are found throughout most of Florida, scarlet kingsnakes prefer more northern and central areas, and scarlet snakes have a more limited distribution in northern Florida.
    `},
    {
        id: 'mojave-western-diamondback',
        title: 'Mojave vs. Western Diamondback Challenge',
        description: 'Learn to distinguish between the highly venomous Mojave Rattlesnake and the Western Diamondback Rattlesnake',
        species: [
            {
                common_name: 'Mojave Rattlesnake',
                taxon_name: 'Crotalus scutulatus',
                taxon_id: '30719',
                venomous: true
            },
            {
                common_name: 'Western Diamondback Rattlesnake',
                taxon_name: 'Crotalus atrox',
                taxon_id: '30764',
                venomous: true
            }
        ],
        region: {
            name: 'Southwestern United States'
        },
        difficulty: 'hard',
        guide: `
What's similar: Both species are large, heavy-bodied rattlesnakes found in desert and semi-desert environments of the southwestern United States. Both have diamond-shaped patterns and can be aggressive when threatened. Both are dangerously venomous and should be treated with extreme caution.

Tail Banding: The most reliable distinguishing feature is the tail pattern. Mojave rattlesnakes have distinct black and white banded tails with the white bands being significantly wider than the black bands (often 2-3 times wider). Western diamondbacks have black and white banded tails where the bands are roughly equal in width, or the black bands may be slightly wider.

Body Pattern: Mojave rattlesnakes typically have well-defined diamond or hexagonal shapes that are often outlined in light colors and filled with a lighter center. The diamonds tend to be more geometric and precise. Western diamondbacks have diamond patterns that are often less distinct, may be more irregular in shape, and the diamonds often become more faded or indistinct toward the tail.

Ground Color: Mojave rattlesnakes often have a greenish, olive, or grayish-green ground color, though they can also be brown or gray. Western diamondbacks typically have a more brownish, tan, or grayish ground color without the greenish tint.

Head Pattern: Both species have postocular stripes (lines running from behind the eye), but Mojave rattlesnakes often have a more distinct light-colored stripe bordered by dark lines. Western diamondbacks may have less distinct head striping, and the postocular (behind the eye) stripe may be less prominent or absent.

Intraocular scales: Mojave rattlesnakes typically have two or three larger, more prominent scales on top of the head between the eyes (intraoculars). Western diamondbacks have four or five smaller scales in this region, often with additional small scales fragmenting the larger ones.

Size and Build: Adult Western diamondbacks are generally larger and more robust, commonly reaching 4-5 feet in length with some specimens over 6 feet. Mojave rattlesnakes are typically smaller, usually 2-4 feet in length, with a somewhat more slender build.

Habitat Preferences: While both inhabit desert environments, Mojave rattlesnakes prefer higher elevation desert areas, grasslands, and scrublands, often at elevations of 1,000-8,000 feet. Western diamondbacks are more commonly found in lower elevation deserts, though their ranges do overlap significantly.

Geographic Distribution: Mojave rattlesnakes are found primarily in the Mojave and Sonoran deserts of California, Nevada, Arizona, and small parts of Utah and Mexico. Western diamondbacks have a broader range extending through much of the southwestern US, including Texas, New Mexico, Arizona, and into Mexico.
`
    }
];

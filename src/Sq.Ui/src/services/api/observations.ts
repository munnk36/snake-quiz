import seedrandom from 'seedrandom';
import { EDUCATIONAL_USE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
import { V1_ENDPOINTS, INATURALIST_API, SERPENTES_TAXON_ID } from "./constants";
import { Observation, SpeciesCount } from './typeDefs';

const MAX_PER_SPECIES = 2;

function weightedRandomSelect(
    items: Array<{ id: number; weight: number }>, 
    rng: () => number
) {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = rng() * totalWeight;
    
    for (const item of items) {
        random -= item.weight;
        if (random <= 0) {
            return item;
        }
    }
    return items[0];
}

export async function getLocationQuizObservation(
    questionIndex: number,
    quizId?: string,
    placeId?: string,
): Promise<{ observation: Observation, quizId: string }> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);
    const rng = seedrandom(generatedQuizId);

    const speciesParams = new URLSearchParams({
        verifiable: 'true',
        identified: 'true',
        captive: 'false',
        native: 'true',
        quality_grade: 'research',
        taxon_id: SERPENTES_TAXON_ID.toString(),
        photo_license: EDUCATIONAL_USE_LICENSES.join(','),
        photos: 'true',
        term_id: '17',
        term_value_id: '18,20', //only living organisms
    });

    if (placeId) {
        speciesParams.append('place_id', placeId);
    }

    const speciesResponse = await fetch(
        `${INATURALIST_API.V1}${V1_ENDPOINTS.SPECIES_COUNT}?${speciesParams}`
    );
    const speciesCountData = await speciesResponse.json();

    // Check if we have enough species for a full quiz (even though we're only getting one question)
    const QUIZ_LENGTH = 10; // Full quiz length
    const requiredSpecies = Math.ceil(QUIZ_LENGTH / MAX_PER_SPECIES);
    
    if (speciesCountData.results.length < requiredSpecies) {
        throw new Error(
            `Not enough species found in this location. Found ${speciesCountData.results.length} species, but need at least ${requiredSpecies} to create a ${QUIZ_LENGTH}-question quiz.`
        );
    }

    const speciesList = speciesCountData.results.map((result: SpeciesCount) => ({
        id: result.taxon.id,
        weight: Math.min(result.count, 1000) // Cap the weight to prevent over-representation
    }));

    // Track which species have been used in previous questions
    const speciesUsedCount: Record<number, number> = {};
    
    for (let i = 0; i < questionIndex; i++) {
        let selectedSpecies;
        do {
            selectedSpecies = weightedRandomSelect(speciesList, rng);
        } while (speciesUsedCount[selectedSpecies.id] >= MAX_PER_SPECIES);
        
        speciesUsedCount[selectedSpecies.id] = (speciesUsedCount[selectedSpecies.id] || 0) + 1;
    }
    
    let targetSpecies;
    do {
        targetSpecies = weightedRandomSelect(speciesList, rng);
    } while (speciesUsedCount[targetSpecies.id] >= MAX_PER_SPECIES);
    
    const observation = await getRandomObservationForSpecies(targetSpecies.id, rng, placeId);
    
    if (!observation) {
        throw new Error("Failed to load observation");
    }

    return {
        observation,
        quizId: generatedQuizId
    };
}

async function getRandomObservationForSpecies(
    targetSpeciesId: number,
    rng: () => number,
    placeId?: string
): Promise<Observation | null> {
    const countParams = new URLSearchParams({
        taxon_id: targetSpeciesId.toString(),
        quality_grade: 'research',
        photos: 'true',
        verifiable: 'true',
        identified: 'true',
        native: 'true',
        captive: 'false',
        photo_license: EDUCATIONAL_USE_LICENSES.join(','),
        term_id: '17',
        term_value_id: '18,20',
        per_page: '1'
    });

    if (placeId) {
        countParams.append('place_id', placeId);
    }

    const countResponse = await fetch(
        `${INATURALIST_API.V1}${V1_ENDPOINTS.OBSERVATIONS}?${countParams}`
    );

    if (!countResponse.ok) {
        console.error(`Failed to get count for species ${targetSpeciesId}`);
        return null;
    }

    const countData = await countResponse.json();
    if (countData.total_results === 0) {
        return null;
    }

    // random page
    const maxPage = Math.min(
        Math.floor(10000 / 1), // API limit
        countData.total_results
    );
    const randomPage = Math.floor(rng() * maxPage) + 1;

    const observationParams = new URLSearchParams({
        ...Object.fromEntries(countParams),
        page: randomPage.toString(),
        order: 'random'
    });

    const observationResponse = await fetch(
        `${INATURALIST_API.V1}${V1_ENDPOINTS.OBSERVATIONS}?${observationParams}`
    );

    if (!observationResponse.ok) {
        console.error(`Failed to fetch observation for species ${targetSpeciesId}`);
        return null;
    }

    const observationData = await observationResponse.json();
    if (!observationData.results?.[0]) {
        return null;
    }

    // Process the observation
    const observation = observationData.results[0];
    
    if (observation.taxon.rank === 'species') {
        return observation;
    }

    if ((observation.taxon.rank === 'complex' || observation.taxon.rank === 'hybrid') &&
        observation.taxon.min_species_taxon_id) {
        try {
            const speciesResponse = await fetch(
                `${INATURALIST_API.V1}${V1_ENDPOINTS.TAXA}/${observation.taxon.min_species_taxon_id}`
            );

            if (!speciesResponse.ok) {
                throw new Error('Failed to fetch species data');
            }

            const taxonData = await speciesResponse.json();
            return {
                ...observation,
                taxon: {
                    ...observation.taxon,
                    children: taxonData.results[0].children,
                }
            };
        } catch (error) {
            console.error('Error fetching species data:', error);
            return observation;
        }
    }

    if (observation.taxon.rank === 'subspecies' && observation.taxon.min_species_taxon_id) {
        try {
            const speciesResponse = await fetch(
                `${INATURALIST_API.V1}${V1_ENDPOINTS.TAXA}/${observation.taxon.min_species_taxon_id}`
            );

            if (!speciesResponse.ok) {
                throw new Error('Failed to fetch species data');
            }

            const taxonData = await speciesResponse.json();

            return {
                ...observation,
                taxon: {
                    ...observation.taxon,
                    name: taxonData.results[0].name,
                    preferred_common_name: taxonData.results[0].preferred_common_name,
                    rank: 'species'
                }
            };
        } catch (error) {
            console.error('Error fetching species data:', error);
            return observation;
        }
    }

    return observation;
}

interface LookalikeQuizParams {
    species: Array<{
        taxon_id: string;
    }>;
    region: {
        place_ids: number[];
    };
}

export async function getLookalikeQuizObservation(
    challenge: LookalikeQuizParams,
    questionIndex: number,
    quizId?: string,
): Promise<{ observation: Observation, quizId: string }> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);
    const rng = seedrandom(generatedQuizId);

    const speciesTaxonIds = challenge.species.map(species => parseInt(species.taxon_id));
    
    const placeIds = challenge.region.place_ids;

    // For lookalike quizzes, we want to distribute questions evenly across species
    const speciesIndex = questionIndex % speciesTaxonIds.length;
    const targetSpeciesId = speciesTaxonIds[speciesIndex];
    
    // Add some randomness to species selection while maintaining balance
    // Every full cycle through all species, we shuffle the order
    const cycleNumber = Math.floor(questionIndex / speciesTaxonIds.length);
    if (cycleNumber > 0) {

        const shuffledIndices = [...Array(speciesTaxonIds.length)].map((_, i) => i);
        for (let i = shuffledIndices.length - 1; i > 0; i--) {
            const j = Math.floor(rng() * (i + 1));
            [shuffledIndices[i], shuffledIndices[j]] = [shuffledIndices[j], shuffledIndices[i]];
        }
        const shuffledSpeciesIndex = shuffledIndices[speciesIndex];
        const finalTargetSpeciesId = speciesTaxonIds[shuffledSpeciesIndex];
        
        const randomPlaceIndex = Math.floor(rng() * placeIds.length);
        const selectedPlaceId = placeIds[randomPlaceIndex].toString();
        
        const observation = await getRandomObservationForSpecies(finalTargetSpeciesId, rng, selectedPlaceId);
        
        if (!observation) {
            throw new Error(`Failed to load observation for species ${finalTargetSpeciesId} in the specified region`);
        }

        return {
            observation,
            quizId: generatedQuizId
        };
    }
    
    // Randomly select a place from the region's place IDs
    const randomPlaceIndex = Math.floor(rng() * placeIds.length);
    const selectedPlaceId = placeIds[randomPlaceIndex].toString();
    
    const observation = await getRandomObservationForSpecies(targetSpeciesId, rng, selectedPlaceId);
    
    if (!observation) {
        throw new Error(`Failed to load observation for species ${targetSpeciesId} in the specified region`);
    }

    return {
        observation,
        quizId: generatedQuizId
    };
}

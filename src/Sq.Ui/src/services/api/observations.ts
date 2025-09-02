import seedrandom from 'seedrandom';
import { EDUCATIONAL_USE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
import { V1_ENDPOINTS, INATURALIST_API, SERPENTES_TAXON_ID } from "./constants";
import { Observation, SpeciesCount } from './typeDefs';
import { 
    DEFAULT_QUIZ_LENGTH, 
    MAX_SPECIES_PER_QUIZ, 
    INATURALIST_API_LIMIT, 
    SPECIES_WEIGHT_CAP, 
    OBSERVATIONS_PER_PAGE 
} from "../../shared/constants";

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

    // Check if we have enough species for a full quiz
    const QUIZ_LENGTH = DEFAULT_QUIZ_LENGTH;
    const requiredSpecies = Math.ceil(QUIZ_LENGTH / MAX_SPECIES_PER_QUIZ);
    
    if (speciesCountData.results.length < requiredSpecies) {
        throw new Error(
            `Not enough species found in this location. Found ${speciesCountData.results.length} species, but need at least ${requiredSpecies} to create a ${QUIZ_LENGTH}-question quiz.`
        );
    }

    const speciesList = speciesCountData.results.map((result: SpeciesCount) => ({
        id: result.taxon.id,
        weight: Math.min(result.count, SPECIES_WEIGHT_CAP) // Cap the weight to prevent over-representation
    }));

    // Track which species have been used in previous questions
    const speciesUsedCount: Record<number, number> = {};
    
    for (let i = 0; i < questionIndex; i++) {
        let selectedSpecies;
        do {
            selectedSpecies = weightedRandomSelect(speciesList, rng);
        } while (speciesUsedCount[selectedSpecies.id] >= MAX_SPECIES_PER_QUIZ);
        
        speciesUsedCount[selectedSpecies.id] = (speciesUsedCount[selectedSpecies.id] || 0) + 1;
    }
    
    let targetSpecies;
    do {
        targetSpecies = weightedRandomSelect(speciesList, rng);
    } while (speciesUsedCount[targetSpecies.id] >= MAX_SPECIES_PER_QUIZ);
    
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
        Math.floor(INATURALIST_API_LIMIT / OBSERVATIONS_PER_PAGE), // API limit
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
        common_name?: string;
    }>;
    region: {
        place_ids?: number[];
    };
}

export async function getCottonwaterLookalikeQuizObservation(
    challenge: LookalikeQuizParams,
    questionIndex: number,
    quizLength: number = DEFAULT_QUIZ_LENGTH,
    quizId?: string,
): Promise<{ observation: Observation, quizId: string }> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);

    if (questionIndex < 0 || questionIndex >= quizLength) {
        throw new Error(`Invalid question index: ${questionIndex}. Must be between 0 and ${quizLength - 1}`);
    }
    
    const speciesRng = seedrandom(generatedQuizId + '-species-' + questionIndex);
    const speciesIndex = Math.floor(speciesRng() * 2); // 0 for cottonmouth, 1 for watersnake
    
    let targetSpeciesId: number;
    
    if (speciesIndex === 0) {
        const cottonmouthSpecies = challenge.species.find(s => s.common_name === 'Cottonmouths');
        targetSpeciesId = parseInt(cottonmouthSpecies?.taxon_id || '30668');
    } else {
        const nerodiaSpecies = challenge.species.find(s => s.common_name === 'Watersnakes');
        targetSpeciesId = parseInt(nerodiaSpecies?.taxon_id || '29299');
    }
    
    const observationRng = seedrandom(generatedQuizId + '-obs-' + questionIndex);
    const observation = await getRandomObservationForSpecies(targetSpeciesId, observationRng);
    
    if (!observation) {
        throw new Error(`Failed to load observation for species ${targetSpeciesId}`);
    }

    return {
        observation,
        quizId: generatedQuizId
    };
}

export async function getLookalikeQuizObservation(
    challenge: LookalikeQuizParams,
    questionIndex: number,
    quizLength: number = DEFAULT_QUIZ_LENGTH,
    quizId?: string,
): Promise<{ observation: Observation, quizId: string }> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);

    if (questionIndex < 0 || questionIndex >= quizLength) {
        throw new Error(`Invalid question index: ${questionIndex}. Must be between 0 and ${quizLength - 1}`);
    }
    
    const speciesTaxonIds = challenge.species.map(species => parseInt(species.taxon_id));
    
    const speciesRng = seedrandom(generatedQuizId + '-species-' + questionIndex);
    const speciesIndex = Math.floor(speciesRng() * speciesTaxonIds.length);
    const targetSpeciesId = speciesTaxonIds[speciesIndex];
    
    const observationRng = seedrandom(generatedQuizId + '-obs-' + questionIndex);
    const observation = await getRandomObservationForSpecies(targetSpeciesId, observationRng);
    
    if (!observation) {
        throw new Error(`Failed to load observation for species ${targetSpeciesId}`);
    }

    return {
        observation,
        quizId: generatedQuizId
    };
}

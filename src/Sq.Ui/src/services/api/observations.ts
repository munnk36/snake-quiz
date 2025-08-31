import seedrandom from 'seedrandom';
import { EDUCATIONAL_USE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
import { V1_ENDPOINTS, INATURALIST_API, SERPENTES_TAXON_ID } from "./constants";
import { Observation, ObservationResponse, SpeciesCount } from './typeDefs';
import { QuizData } from '../../shared/constants';

const MAX_PER_SPECIES = 2;

export async function getQuizObservationsV1 (
    numberOfObservations: number,
    quizId?: string,
    placeId?: string,
): Promise<QuizData> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);
    const rng = seedrandom(generatedQuizId);

    // First get total count
    const countParams = new URLSearchParams({
        taxon_id: SERPENTES_TAXON_ID.toString(),
        quality_grade: 'research',
        photos: 'true',
        per_page: '1',
        verifiable: 'true',
        photo_license: EDUCATIONAL_USE_LICENSES.join(','),
        term_id: '17',
        term_value_id: '18,20', //only show live animals
    });

    if (placeId) {
        countParams.append('place_id', placeId);
    }

    const countResponse = await fetch(
        `${INATURALIST_API.V1}${V1_ENDPOINTS.OBSERVATIONS}?${countParams}`
    );

    if (!countResponse.ok) {
        throw new Error('Failed to fetch observation count');
    }

    const countData: ObservationResponse = await countResponse.json();
    
    const maxRecords = 10000;
    const maxPage = Math.min(
        Math.floor(maxRecords / numberOfObservations),
        Math.floor(countData.total_results / numberOfObservations)
    );
    
    const randomPage = Math.floor(rng() * maxPage) + 1;

    const observationParams = new URLSearchParams({
        taxon_id: SERPENTES_TAXON_ID.toString(),
        quality_grade: 'research',
        photos: 'true',
        per_page: numberOfObservations.toString(),
        page: randomPage.toString(),
        order: 'random',
        verifiable: 'true',
        photo_license: EDUCATIONAL_USE_LICENSES.join(','),
        term_id: '17',
        term_value_id: '18,20',
    });

    if (placeId) {
        observationParams.append('place_id', placeId);
    }
    
    const observationResponse = await fetch(
        `${INATURALIST_API.V1}${V1_ENDPOINTS.OBSERVATIONS}?${observationParams}`
    );

    if (!observationResponse.ok) {
        throw new Error('Failed to fetch observations');
    }

    const observationData: ObservationResponse = await observationResponse.json();

    const processedObservations = await Promise.all(
        observationData.results.map(async (observation) => {
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
                    return observation; // Fallback to original observation if fetch fails
                }
            }

            //if our observation we need to back it out to the species level. (otherwise, users will always be able to know it's the subspecies)
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
                    return observation; // Fallback to original observation if fetch fails
                }
            }

            return observation;
        })
    );

    return {
        quizId: generatedQuizId,
        observations: processedObservations,
    };
};

export async function getQuizObservations(
    numberOfObservations: number,
    quizId?: string,
    placeId?: string,
): Promise<QuizData> {
    const generatedQuizId = quizId || Math.random().toString(36).substring(2, 15);
    const rng = seedrandom(generatedQuizId);

    // 1. First get all species in the place
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

    // Check if we have enough species for the quiz
    const requiredSpecies = Math.ceil(numberOfObservations / MAX_PER_SPECIES);
    
    if (speciesCountData.results.length < requiredSpecies) {
        throw new Error(
            `Not enough species found in this location. Found ${speciesCountData.results.length} species, but need at least ${requiredSpecies} to create a ${numberOfObservations}-question quiz.`
        );
    }

    // weighted distribution of counts of species
    const speciesList = speciesCountData.results.map((result: SpeciesCount) => ({
        id: result.taxon.id,
        weight: Math.min(result.count, 1000) // Cap the weight to prevent over-representation
    }));

    // weighted random selection
    const observations: Observation[] = [];
    const speciesUsedCount: Record<number, number> = {};

    while (observations.length < numberOfObservations) {
        // Get random page for current species
        const targetSpecies = weightedRandomSelect(speciesList, rng);
        if (speciesUsedCount[targetSpecies.id] >= MAX_PER_SPECIES) {
            continue;
        }

        // Fetch observation for this species
        const obs = await getRandomObservationForSpecies(targetSpecies.id, rng, placeId);
        if (obs) {
            observations.push(obs);
            speciesUsedCount[targetSpecies.id] = (speciesUsedCount[targetSpecies.id] || 0) + 1;
        }
    }

    return {
        quizId: generatedQuizId,
        observations
    };
}

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

export async function getSingleQuizObservation(
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

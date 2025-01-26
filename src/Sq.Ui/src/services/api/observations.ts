import seedrandom from 'seedrandom';
// import { COMMERCIAL_SAFE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
import { V1_ENDPOINTS, INATURALIST_API, SERPENTES_TAXON_ID } from "./constants";
import { ObservationResponse, QuizData } from './typeDefs';

export async function getQuizObservations (
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
        // photo_license: COMMERCIAL_SAFE_LICENSES.join(','),
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
        // photo_license: COMMERCIAL_SAFE_LICENSES.join(','),
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

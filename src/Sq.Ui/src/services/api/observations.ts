import seedrandom from 'seedrandom';
import { COMMERCIAL_SAFE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
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
        photo_license: COMMERCIAL_SAFE_LICENSES.join(','),
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
        photo_license: COMMERCIAL_SAFE_LICENSES.join(','),
        term_value_id: '18',
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

    return {
        quizId: generatedQuizId,
        observations: observationData.results
    };
};

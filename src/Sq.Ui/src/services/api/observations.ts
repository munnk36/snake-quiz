import seedrandom from 'seedrandom';
import { COMMERCIAL_SAFE_LICENSES } from "../../shared/components/PhotoAttribution/constants";
import { API_ENDPOINTS, API_HOST, SERPENTES_TAXON_ID } from "./constants";

export interface ObservationPhoto {
    url: string;
    attribution: string;
}

export interface Observation {
    id: number;
    species_guess: string;
    photos: ObservationPhoto[];
    place_guess: string;
    user: {
        login: string;
        name: string;
    };
    license_code: string;
}

export interface ObservationResponse {
    total_results: number;
    results: Observation[];
}

export interface QuizData {
    quizId: string;
    observations: Observation[];
}

export const getQuizObservations = async (
    quizId?: string,
    numberOfObservations: number = 10
): Promise<QuizData> => {
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
        term_value_id: '18',
    });

    const countResponse = await fetch(
        `${API_HOST}${API_ENDPOINTS.OBSERVATIONS}?${countParams}`
    );

    if (!countResponse.ok) {
        throw new Error('Failed to fetch observation count');
    }

    const countData: ObservationResponse = await countResponse.json();
    
    // Calculate max page while respecting the 10000 record limit
    const maxRecords = 10000;
    const maxPage = Math.min(
        Math.floor(maxRecords / numberOfObservations),
        Math.floor(countData.total_results / numberOfObservations)
    );
    
    // Get our seeded random page
    const randomPage = Math.floor(rng() * maxPage) + 1;

    // Fetch our actual observations
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

    const observationResponse = await fetch(
        `${API_HOST}${API_ENDPOINTS.OBSERVATIONS}?${observationParams}`
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

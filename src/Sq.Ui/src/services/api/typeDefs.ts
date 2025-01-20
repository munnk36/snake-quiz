
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
    taxon: {
        min_species_taxon_id: number;
        name: string;
        preferred_common_name: string;
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

export interface Taxon {
    id: number;
    name: string;
    preferred_common_name?: string;
    ancestor_ids: number[];
    extinct: boolean;
    iconic_taxon_name: string;
    is_active: boolean;
    rank: string;
    rank_level: number;
}

export interface SimilarSpeciesResult {
    taxon: Taxon;
    count: number;
}

export interface SimilarSpeciesResponse {
    total_results: number;
    page: number;
    per_page: number;
    results: SimilarSpeciesResult[];
}
export interface QuizState {
    currentQuestionIndex: number;
    score: number;
    answers: QuizAnswer[];
}

export interface QuizAnswer {
    observationId: number;
    selectedTaxonId: number;
    isCorrect: boolean;
    correctAnswer: {
        preferredCommonName: string;
        scientificName: string;
    };
    userAnswer: {
        preferredCommonName: string;
        scientificName: string;
    };
    observationImageUrl: string;

}

export interface QuizGuessOption {
    taxonId: number;
    scientificName: string;
    preferredCommonName: string;
    isCorrect: boolean;
}

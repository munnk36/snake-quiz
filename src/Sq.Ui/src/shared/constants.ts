import { Observation } from "../services/api/typeDefs";

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

export interface QuizData {
    quizId: string;
    observations: Observation[];
}

// Quiz Configuration Constants
export const DEFAULT_QUIZ_LENGTH = 10;

// Species Distribution Constants
export const MAX_SPECIES_PER_QUIZ = 2;

// API Limits and Caps
export const INATURALIST_API_LIMIT = 10000;
export const SPECIES_WEIGHT_CAP = 1000;

// Pagination
export const OBSERVATIONS_PER_PAGE = 1;

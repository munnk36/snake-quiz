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
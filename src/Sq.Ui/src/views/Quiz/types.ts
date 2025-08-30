import { QuizGuessOption } from '../../shared/constants';

export interface QuizQuestionProps {
    observation: import('../../services/api/typeDefs').Observation;
    onAnswer: (
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => void;
}

export interface QuizOptionProps {
    option: QuizGuessOption;
    onSelect: (option: QuizGuessOption) => void;
    disabled?: boolean;
    isSelected?: boolean;
    showResult?: boolean;
}

export interface QuizResultsProps {
    answers: import('../../shared/constants').QuizAnswer[];
    score: number;
    totalQuestions: number;
}

export interface QuizProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    score: number;
}

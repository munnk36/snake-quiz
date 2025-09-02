import { QuizAnswer } from '../../shared/constants';

export interface LookalikeSpecies {
    common_name?: string;
    taxon_name: string;
    taxon_id: string | string[];
    venomous: boolean;
}

export interface LookalikeAnswerGroup {
    group_name: string;
    common_name: string;
    venomous: boolean;
    species: LookalikeSpecies[];
}

export interface LookalikeRegion {
    name: string;
    place_ids?: number[];
}

export interface LookalikeChallenge {
    id: string;
    title: string;
    description: string;
    possibleAnswers: LookalikeAnswerGroup[];
    region: LookalikeRegion;
    difficulty?: 'easy' | 'medium' | 'hard';
    guide?: string;
}

export interface LookalikeQuizState {
    currentQuestionIndex: number;
    score: number;
    answers: QuizAnswer[];
    isCompleted: boolean;
}

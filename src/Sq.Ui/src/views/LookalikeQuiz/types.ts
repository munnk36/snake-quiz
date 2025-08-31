import { QuizAnswer } from '../../shared/constants';

export interface LookalikeSpecies {
    common_name?: string;
    taxon_name: string;
    taxon_id: string;
}

export interface LookalikeRegion {
    name: string;
    place_ids: number[];
}

export interface LookalikeChallenge {
    id: string;
    title: string;
    description: string;
    species: LookalikeSpecies[];
    region: LookalikeRegion;
    difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LookalikeQuizState {
    currentQuestionIndex: number;
    score: number;
    answers: QuizAnswer[];
    isCompleted: boolean;
}

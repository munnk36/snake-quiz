import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getQuizObservations, Observation } from './observations';

interface QuizData {
    quizId: string;
    observations: Observation[];
}

export const useQuizObservations = (
    quizId?: string,
    numberOfObservations: number = 10
): UseQueryResult<QuizData, Error> => {
    return useQuery({
        queryKey: ['quiz', quizId || 'random'],
        queryFn: () => getQuizObservations(quizId, numberOfObservations),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

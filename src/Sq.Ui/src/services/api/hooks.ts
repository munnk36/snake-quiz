import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { getQuizObservations, QuizData } from './observations';

export default function useQuizObservations(
    numberOfObservations: number = 10,
    quizId?: string,
    placeId?: string,
): UseQueryResult<QuizData, Error> {
    return useQuery({
        queryKey: ['quiz', quizId || 'random'],
        queryFn: () => getQuizObservations(numberOfObservations, quizId, placeId),
        staleTime: Infinity,
        refetchOnWindowFocus: false
    });
};

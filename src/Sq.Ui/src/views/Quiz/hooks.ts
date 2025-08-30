import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuizObservation } from '../../services/api/hooks';
import { QuizState, QuizAnswer } from '../../shared/constants';
import { Observation } from '../../services/api/typeDefs';
import { getMediumImageUrl } from '../../shared/utils/imageUtils';

// Constants
export const QUIZ_LENGTH = 10;

export function useQuizState() {
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
    });

    const isCompleted = quizState.answers.length === QUIZ_LENGTH;

    const handleAnswer = useCallback((
        observation: Observation,
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => {
        setQuizState(prev => {
            const newAnswer: QuizAnswer = {
                observationId: observation.id,
                selectedTaxonId,
                isCorrect,
                correctAnswer: {
                    preferredCommonName: observation.taxon.preferred_common_name || '',
                    scientificName: observation.taxon.name
                },
                userAnswer,
                observationImageUrl: getMediumImageUrl(observation.photos[0].url)
            };
            
            return {
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                score: isCorrect ? prev.score + 1 : prev.score,
                answers: [...prev.answers, newAnswer]
            };
        });
    }, []);

    return {
        quizState,
        isCompleted,
        handleAnswer,
    };
}

/**
 * Custom hook for managing quiz navigation and URL synchronization
 * Handles canonical URL redirects when quiz ID changes
 */
export function useQuizNavigation(
    fetchedQuizId: string | undefined,
    quizId: string | null,
    placeId: string | null,
    error: Error | null
) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!fetchedQuizId || error) return;

        const needsRedirect = fetchedQuizId && (
            !quizId || 
            quizId !== fetchedQuizId
        );

        if (needsRedirect) {
            const newParams = new URLSearchParams();
            newParams.set('id', fetchedQuizId);
            
            if (placeId) {
                newParams.set('place', placeId);
            }

            navigate({
                pathname: '/quiz',
                search: `?${newParams.toString()}`
            }, { 
                replace: true,
                state: { canonicalRedirect: true }
            });
        }
    }, [fetchedQuizId, quizId, placeId, navigate, error]);
}

/**
 * Custom hook for managing observations cache
 * Provides efficient caching and retrieval of quiz observations
 */
export function useObservationsCache() {
    const [fetchedObservations, setFetchedObservations] = useState<Observation[]>([]);

    const addObservation = useCallback((observation: Observation, index: number) => {
        setFetchedObservations(prev => {
            if (prev[index]) return prev; // Already cached
            
            const updated = [...prev];
            updated[index] = observation;
            return updated;
        });
    }, []);

    const getObservation = useCallback((index: number) => {
        return fetchedObservations[index];
    }, [fetchedObservations]);

    return {
        fetchedObservations,
        addObservation,
        getObservation,
    };
}

/**
 * Custom hook for managing current question data
 * Handles API calls for current and next questions with prefetching
 */
export function useCurrentQuestion(
    currentQuestionIndex: number,
    quizId: string,
    placeId: string
) {
    const { 
        data, 
        isLoading, 
        error 
    } = useQuizObservation(currentQuestionIndex, quizId, placeId);

    // Prefetch next question for better user experience
    const nextQuestionIndex = currentQuestionIndex + 1;
    useQuizObservation(
        nextQuestionIndex < QUIZ_LENGTH ? nextQuestionIndex : 0,
        quizId, 
        placeId
    );

    return {
        currentObservation: data?.observation,
        fetchedQuizId: data?.quizId,
        isLoading,
        error,
    };
}
import { useState, useEffect } from 'react';
import { getLookalikeQuizObservation } from '../../services/api/observations';
import { LookalikeChallenge, LookalikeQuizState } from './types';
import { Observation } from '../../services/api/typeDefs';
import { QUIZ_LENGTH } from './constants';

export { QUIZ_LENGTH };

export function useLookalikeQuizState() {
    const [quizState, setQuizState] = useState<LookalikeQuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isCompleted: false
    });

    const isCompleted = quizState.currentQuestionIndex >= QUIZ_LENGTH;

    const handleAnswer = (
        observation: Observation,
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => {
        const newAnswer = {
            observationId: observation.id,
            selectedTaxonId,
            isCorrect,
            correctAnswer: {
                preferredCommonName: observation.taxon.preferred_common_name || observation.taxon.name,
                scientificName: observation.taxon.name
            },
            userAnswer,
            observationImageUrl: observation.photos[0]?.url || ''
        };

        setQuizState(prev => ({
            ...prev,
            answers: [...prev.answers, newAnswer],
            score: prev.score + (isCorrect ? 1 : 0),
            isCompleted: prev.currentQuestionIndex + 1 >= QUIZ_LENGTH
        }));
    };

    return {
        quizState,
        isCompleted,
        handleAnswer
    };
}

export function useCurrentLookalikeQuestion(
    challenge: LookalikeChallenge | null,
    currentQuestionIndex: number,
    quizId?: string
) {
    const [currentObservation, setCurrentObservation] = useState<Observation | null>(null);
    const [fetchedQuizId, setFetchedQuizId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!challenge) {
            setIsLoading(false);
            return;
        }

        const fetchObservation = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const result = await getLookalikeQuizObservation(
                    challenge,
                    currentQuestionIndex,
                    quizId
                );

                setCurrentObservation(result.observation);
                setFetchedQuizId(result.quizId);
            } catch (err) {
                console.error('Error fetching lookalike quiz observation:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCurrentObservation(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchObservation();
    }, [challenge, currentQuestionIndex, quizId]);

    return {
        currentObservation,
        fetchedQuizId,
        isLoading,
        error
    };
}

export function useObservationsCache() {
    const [observationsCache, setObservationsCache] = useState<Record<number, Observation>>({});

    const addObservation = (observation: Observation, index: number) => {
        setObservationsCache(prev => ({
            ...prev,
            [index]: observation
        }));
    };

    const getObservation = (index: number) => {
        return observationsCache[index];
    };

    return {
        addObservation,
        getObservation
    };
}

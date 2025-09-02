import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLookalikeQuizObservation, getCottonwaterLookalikeQuizObservation } from '../../services/api/observations';
import { LookalikeChallenge, LookalikeQuizState } from './types';
import { Observation } from '../../services/api/typeDefs';
import { DEFAULT_QUIZ_LENGTH } from '../../shared/constants';

interface LookalikeQuizOption {
    taxonId: number;
    scientificName: string;
    preferredCommonName: string;
    isCorrect: boolean;
    venomous: boolean;
}

export { DEFAULT_QUIZ_LENGTH };

export function useLookalikeQuizState() {
    const [quizState, setQuizState] = useState<LookalikeQuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isCompleted: false
    });

    const isCompleted = quizState.currentQuestionIndex >= DEFAULT_QUIZ_LENGTH;

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
            currentQuestionIndex: prev.currentQuestionIndex + 1,
            answers: [...prev.answers, newAnswer],
            score: prev.score + (isCorrect ? 1 : 0),
            isCompleted: prev.currentQuestionIndex + 1 >= DEFAULT_QUIZ_LENGTH
        }));
    };

    return {
        quizState,
        isCompleted,
        handleAnswer
    };
}

export function useLookalikeQuizNavigation(
    fetchedQuizId: string | undefined,
    quizId: string | null,
    challengeId: string | null,
    error: string | null
) {
    const navigate = useNavigate();

    useEffect(() => {
        if (!fetchedQuizId || error) return;

        const needsRedirect = fetchedQuizId && (
            !quizId || 
            quizId !== fetchedQuizId
        );

        if (needsRedirect) {
            // Preserve existing search parameters
            const currentParams = new URLSearchParams(window.location.search);
            currentParams.set('id', fetchedQuizId);
            
            if (challengeId) {
                currentParams.set('challenge', challengeId);
            }

            navigate({
                pathname: '/lookalike-quiz',
                search: `?${currentParams.toString()}`
            }, { 
                replace: true,
                state: { canonicalRedirect: true }
            });
        }
    }, [fetchedQuizId, quizId, challengeId, navigate, error]);
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
        if (!challenge || currentQuestionIndex >= DEFAULT_QUIZ_LENGTH) {
            setIsLoading(false);
            return;
        }

        const fetchObservation = async () => {
            try {
                setIsLoading(true);
                setError(null);

                // Use specialized function for cottonmouth-watersnake challenge
                const fetchFunction = challenge.id === 'cottonmouth-watersnake' 
                    ? getCottonwaterLookalikeQuizObservation 
                    : getLookalikeQuizObservation;

                const result = await fetchFunction(
                    challenge,
                    currentQuestionIndex,
                    DEFAULT_QUIZ_LENGTH,
                    quizId
                );

                setCurrentObservation(result.observation);
                setFetchedQuizId(result.quizId);
            } catch (err) {
                console.error('Error fetching lookalike quiz observation:', err);
                setError(err instanceof Error ? err.message : 'An error occurred');
                setCurrentObservation(null);
                setFetchedQuizId('');
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

export function useLookalikeQuizOptions(
    challenge: LookalikeChallenge | null,
    observation: Observation | null
) {
    const [quizOptions, setQuizOptions] = useState<LookalikeQuizOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!challenge || !observation) {
            setQuizOptions([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Use the possibleAnswers structure
            const options: LookalikeQuizOption[] = challenge.possibleAnswers.map(group => {
                // Check if any species in this group matches the observation
                const isCorrect = group.species.some(species => {
                    const taxonIds = Array.isArray(species.taxon_id) 
                        ? species.taxon_id.map(id => parseInt(id))
                        : [parseInt(species.taxon_id)];
                    
                    return taxonIds.some(taxonId => 
                        observation.taxon.id === taxonId || 
                        observation.taxon.ancestor_ids.includes(taxonId)
                    );
                });
                
                return {
                    taxonId: parseInt(Array.isArray(group.species[0].taxon_id) ? group.species[0].taxon_id[0] : group.species[0].taxon_id),
                    scientificName: group.species.map(s => s.taxon_name).join(', '),
                    preferredCommonName: group.common_name,
                    isCorrect,
                    venomous: group.venomous
                };
            });
            setQuizOptions(options);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate options');
        } finally {
            setIsLoading(false);
        }
    }, [challenge, observation]);

    return {
        quizOptions,
        isLoading,
        error
    };
}

export function useObservationsCache() {
    const [observationsCache, setObservationsCache] = useState<Record<number, Observation>>({});

    const addObservation = useCallback((observation: Observation, index: number) => {
        setObservationsCache(prev => ({
            ...prev,
            [index]: observation
        }));
    }, []);

    const getObservation = useCallback((index: number) => {
        return observationsCache[index];
    }, [observationsCache]);

    return {
        addObservation,
        getObservation
    };
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useQuizObservation } from '../../services/api/hooks';
import QuizQuestion from './QuizQuestion';
import styles from './styles.module.scss';
import QuizResults from './QuizResult';
import { QuizState, QuizAnswer } from '../../shared/constants';
import { Observation } from '../../services/api/typeDefs';
import { getMediumImageUrl } from '../../shared/utils/imageUtils';

// Define the quiz length as a constant for easier modification
const QUIZ_LENGTH = 10;

export default function QuizPage() {
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get('place');
    const quizId = searchParams.get('id');
    const navigate = useNavigate();
    
    // Track the current question index and fetched observations
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [fetchedObservations, setFetchedObservations] = useState<Observation[]>([]);
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
    });
    
    // Fetch the current observation
    const { 
        data, 
        isLoading, 
        error 
    } = useQuizObservation(currentQuestionIndex, quizId || '', placeId || '');
    
    const currentObservation = data?.observation;
    const fetchedQuizId = data?.quizId;
    
    // Track completion
    const isCompleted = quizState.answers.length === QUIZ_LENGTH;
    
    // Handle redirection for canonical URL
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
    
    // Add current observation to fetched list when loaded
    useEffect(() => {
        if (currentObservation && !fetchedObservations[currentQuestionIndex]) {
            setFetchedObservations(prev => {
                const updated = [...prev];
                updated[currentQuestionIndex] = currentObservation;
                return updated;
            });
        }
    }, [currentObservation, currentQuestionIndex, fetchedObservations]);
    
    // Prefetch next question
    const nextQuestionIndex = currentQuestionIndex + 1;
    useQuizObservation(
        nextQuestionIndex < QUIZ_LENGTH ? nextQuestionIndex : 0,
        quizId || '', 
        placeId || ''
    );
    
    const handleAnswer = useCallback((
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => {
        const observation = currentObservation || fetchedObservations[currentQuestionIndex];
        if (!observation) return;
        
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
        
        setCurrentQuestionIndex(prev => prev + 1);
    }, [currentObservation, fetchedObservations, currentQuestionIndex]);
    
    if (isCompleted) {
        // Show results when all questions are answered
        return (
            <QuizResults 
                answers={quizState.answers}
                score={quizState.score}
                totalQuestions={QUIZ_LENGTH}
            />
        );
    }
    
    if (isLoading && fetchedObservations.length === 0) {
        return <div>Loading quiz...</div>;
    }

    if (error) {
        return <div>Error loading quiz: {error.message}</div>;
    }
    
    if (!currentObservation && !fetchedObservations[currentQuestionIndex]) {
        return <div>Loading next question...</div>;
    }
    
    const observation = currentObservation || fetchedObservations[currentQuestionIndex];
    
    return (
        <div className={styles['quiz-wrapper']}>
            <div className={styles['quiz-progress']}>
                <div>Question {currentQuestionIndex + 1} of {QUIZ_LENGTH}</div>
                <div>Score: {quizState.score}</div>
            </div>
            <div className={styles['quiz-question']}>
                <QuizQuestion
                    observation={observation}
                    onAnswer={handleAnswer}
                />
            </div>
        </div>
    );
}

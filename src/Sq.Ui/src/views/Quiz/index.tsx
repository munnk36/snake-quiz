import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResult';
import QuizProgress from './QuizProgress';
import QuizLoadingStates from './QuizLoadingStates';
import styles from './styles.module.scss';
import { 
    useQuizState, 
    useQuizNavigation, 
    useObservationsCache, 
    useCurrentQuestion,
    QUIZ_LENGTH 
} from './hooks';

export default function QuizPage() {
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get('place');
    const quizId = searchParams.get('id');
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    // Custom hooks for better separation of concerns
    const { quizState, isCompleted, handleAnswer } = useQuizState();
    const { addObservation, getObservation } = useObservationsCache();
    const { 
        currentObservation, 
        fetchedQuizId, 
        isLoading, 
        error 
    } = useCurrentQuestion(currentQuestionIndex, quizId || '', placeId || '');
    
    // Handle URL synchronization
    useQuizNavigation(fetchedQuizId, quizId, placeId, error);
    
    useEffect(() => {
        if (currentObservation) {
            addObservation(currentObservation, currentQuestionIndex);
        }
    }, [currentObservation, currentQuestionIndex, addObservation]);
    
    const onAnswer = (
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => {
        const observation = currentObservation || getObservation(currentQuestionIndex);
        if (!observation) return;
        
        handleAnswer(observation, selectedTaxonId, isCorrect, userAnswer);
        setCurrentQuestionIndex(prev => prev + 1);
    };
    
    if (isCompleted) {
        return (
            <QuizResults 
                answers={quizState.answers}
                score={quizState.score}
                totalQuestions={QUIZ_LENGTH}
            />
        );
    }
    
    const observation = currentObservation || getObservation(currentQuestionIndex);
    
    return (
        <QuizLoadingStates
            isLoading={isLoading}
            error={error}
            hasObservations={!!observation}
        >
            <div className={styles['quiz-wrapper']}>
                <QuizProgress 
                    currentQuestion={currentQuestionIndex + 1}
                    totalQuestions={QUIZ_LENGTH}
                    score={quizState.score}
                />
                
                <div className={styles['quiz-question']}>
                    {observation && (
                        <QuizQuestion
                            observation={observation}
                            onAnswer={onAnswer}
                        />
                    )}
                </div>
            </div>
        </QuizLoadingStates>
    );
}

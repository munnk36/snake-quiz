import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import MultipleChoiceQuestion from './MultipleChoiceQuestion';
import ScientificNameQuestion from './ScientificNameQuestion';
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

export default function LocationQuizPage() {
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get('place');
    const quizId = searchParams.get('id');
    const mode = searchParams.get('mode') || 'multiple-choice';
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    const { quizState, isCompleted, handleAnswer } = useQuizState();
    const { addObservation, getObservation } = useObservationsCache();
    const { 
        currentObservation, 
        fetchedQuizId, 
        isLoading, 
        error 
    } = useCurrentQuestion(currentQuestionIndex, quizId || '', placeId || '');
    
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
                        mode === 'scientific' ? (
                            <ScientificNameQuestion
                                observation={observation}
                                onAnswer={onAnswer}
                            />
                        ) : (
                            <MultipleChoiceQuestion
                                observation={observation}
                                onAnswer={onAnswer}
                            />
                        )
                    )}
                </div>
            </div>
        </QuizLoadingStates>
    );
}

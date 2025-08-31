import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import styles from './styles.module.scss';
import { LOOKALIKE_CHALLENGES } from './constants';
import { 
    useLookalikeQuizState, 
    useCurrentLookalikeQuestion, 
    useObservationsCache,
    QUIZ_LENGTH 
} from './hooks';
import QuizProgress from './QuizProgress';
import QuizQuestion from './QuizQuestion';
import QuizResult from './QuizResult';

export default function LookalikeQuiz() {
    const [searchParams] = useSearchParams();
    const challengeId = searchParams.get('challenge');
    
    const challenge = LOOKALIKE_CHALLENGES.find(c => c.id === challengeId);
    
    const { quizState, isCompleted, handleAnswer } = useLookalikeQuizState();
    const { addObservation, getObservation } = useObservationsCache();
    const { 
        currentObservation, 
        isLoading, 
        error 
    } = useCurrentLookalikeQuestion(challenge || null, quizState.currentQuestionIndex);

    useEffect(() => {
        if (currentObservation) {
            addObservation(currentObservation, quizState.currentQuestionIndex);
        }
    }, [currentObservation, quizState.currentQuestionIndex, addObservation]);

    const onAnswer = (
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => {
        const observation = currentObservation || getObservation(quizState.currentQuestionIndex);
        if (!observation) return;
        
        handleAnswer(observation, selectedTaxonId, isCorrect, userAnswer);
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleBackToModeSelect = () => {
        window.location.href = '/lookalike-mode-select';
    };

    if (!challenge) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Challenge Not Found</h2>
                    <p>The requested lookalike challenge could not be found.</p>
                    <button onClick={handleGoHome} className={styles.homeButton}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <h2>Loading {challenge.title}...</h2>
                    <p>Preparing your lookalike challenge...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Error Loading Challenge</h2>
                    <p>{error}</p>
                    <button onClick={handleBackToModeSelect} className={styles.backButton}>
                        Back to Challenges
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted) {
        return (
            <div className={styles.container}>
                <QuizResult 
                    score={quizState.score}
                    totalQuestions={QUIZ_LENGTH}
                    answers={quizState.answers}
                />
                <div className={styles.actionButtons}>
                    <button onClick={handleBackToModeSelect} className={styles.backButton}>
                        Try Another Challenge
                    </button>
                    <button onClick={handleGoHome} className={styles.homeButton}>
                        Go Home
                    </button>
                </div>
            </div>
        );
    }

    const observation = currentObservation || getObservation(quizState.currentQuestionIndex);
    
    return (
        <div className={styles.container}>
            <div className={styles.quizHeader}>
                <h1>{challenge.title}</h1>
            </div>
            
            <QuizProgress 
                currentQuestion={quizState.currentQuestionIndex + 1}
                totalQuestions={QUIZ_LENGTH}
                score={quizState.score}
            />

            <div className={styles.quizContent}>
                {observation ? (
                    <QuizQuestion 
                        observation={observation}
                        challenge={challenge}
                        onAnswer={onAnswer}
                    />
                ) : (
                    <div className={styles.errorState}>
                        <h3>Failed to load question</h3>
                        <p>Unable to load observation for this question.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

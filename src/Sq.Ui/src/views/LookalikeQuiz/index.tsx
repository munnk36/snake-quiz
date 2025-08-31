import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { LOOKALIKE_CHALLENGES } from './constants';
import { 
    useLookalikeQuizState, 
    useCurrentLookalikeQuestion, 
    useObservationsCache,
    QUIZ_LENGTH 
} from './hooks';

export default function LookalikeQuiz() {
    const [searchParams] = useSearchParams();
    const challengeId = searchParams.get('challenge');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    
    const challenge = LOOKALIKE_CHALLENGES.find(c => c.id === challengeId);
    
    const { quizState, isCompleted, handleAnswer } = useLookalikeQuizState();
    const { addObservation, getObservation } = useObservationsCache();
    const { 
        currentObservation, 
        isLoading, 
        error 
    } = useCurrentLookalikeQuestion(challenge || null, currentQuestionIndex);

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
                <div className={styles.resultsContainer}>
                    <h2>Challenge Complete!</h2>
                    <div className={styles.scoreDisplay}>
                        <div className={styles.score}>
                            {quizState.score}/{QUIZ_LENGTH}
                        </div>
                        <div className={styles.percentage}>
                            {Math.round((quizState.score / QUIZ_LENGTH) * 100)}%
                        </div>
                    </div>
                    
                    <div className={styles.actionButtons}>
                        <button onClick={handleBackToModeSelect} className={styles.backButton}>
                            Try Another Challenge
                        </button>
                        <button onClick={handleGoHome} className={styles.homeButton}>
                            Go Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const observation = currentObservation || getObservation(currentQuestionIndex);
    
    return (
        <div className={styles.container}>
            <div className={styles.quizHeader}>
                <h1>{challenge.title}</h1>
                <div className={styles.progress}>
                    Question {currentQuestionIndex + 1} of {QUIZ_LENGTH} | Score: {quizState.score}
                </div>
            </div>

            <div className={styles.quizContent}>
                {isLoading ? (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <h3>Loading question {currentQuestionIndex + 1}...</h3>
                    </div>
                ) : observation ? (
                    <div className={styles.questionContainer}>
                        <div className={styles.observationImage}>
                            <img 
                                src={observation.photos[0]?.url} 
                                alt="Snake observation" 
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.questionText}>
                            <h3>What species is this snake?</h3>
                            <p>Location: {observation.place_guess}</p>
                            
                            {/* TODO: Add actual question component */}
                            <div className={styles.placeholder}>
                                <p>Quiz question component will go here</p>
                                <p>Observation ID: {observation.id}</p>
                                <p>Correct answer: {observation.taxon.name}</p>
                                
                                <button 
                                    onClick={() => onAnswer(
                                        observation.taxon.id,
                                        true,
                                        {
                                            preferredCommonName: observation.taxon.preferred_common_name || '',
                                            scientificName: observation.taxon.name
                                        }
                                    )}
                                    className={styles.nextButton}
                                >
                                    Answer Correctly (Placeholder)
                                </button>
                            </div>
                        </div>
                    </div>
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

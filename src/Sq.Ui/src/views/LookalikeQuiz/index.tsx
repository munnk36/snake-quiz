import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { LookalikeQuizState } from './types';
import { LOOKALIKE_CHALLENGES, QUIZ_LENGTH } from './constants';

export default function LookalikeQuiz() {
    const [searchParams] = useSearchParams();
    const challengeId = searchParams.get('challenge');
    
    const [quizState, setQuizState] = useState<LookalikeQuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isCompleted: false
    });

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const challenge = LOOKALIKE_CHALLENGES.find(c => c.id === challengeId);

    useEffect(() => {
        if (!challenge) {
            setError('Challenge not found');
            setIsLoading(false);
            return;
        }

        // TODO: Load observations for this challenge
        // For now, just simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, [challenge]);

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

    if (quizState.isCompleted) {
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

    return (
        <div className={styles.container}>
            <div className={styles.quizHeader}>
                <h1>{challenge.title}</h1>
                <div className={styles.progress}>
                    Question {quizState.currentQuestionIndex + 1} of {QUIZ_LENGTH} | Score: {quizState.score}
                </div>
            </div>

            <div className={styles.quizContent}>
                <div className={styles.placeholder}>
                    <h3>Quiz Question Placeholder</h3>
                    <p>This is where the actual quiz question will go.</p>
                    <p>Challenge: {challenge.title}</p>
                    <p>Species: {challenge.species.map(s => s.taxon_name).join(', ')}</p>
                    <p>Region: {challenge.region.name}</p>
                    <p>Difficulty: {challenge.difficulty || 'Not specified'}</p>
                    
                    <button 
                        onClick={() => setQuizState(prev => ({
                            ...prev,
                            currentQuestionIndex: prev.currentQuestionIndex + 1,
                            score: prev.score + 1,
                            isCompleted: prev.currentQuestionIndex + 1 >= QUIZ_LENGTH
                        }))}
                        className={styles.nextButton}
                    >
                        Next Question (Placeholder)
                    </button>
                </div>
            </div>
        </div>
    );
}

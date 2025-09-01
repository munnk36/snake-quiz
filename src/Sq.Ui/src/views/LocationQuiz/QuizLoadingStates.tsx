import styles from './styles.module.scss';

interface QuizLoadingStatesProps {
    isLoading: boolean;
    error: Error | null;
    hasObservations: boolean;
    children: React.ReactNode;
}

export default function QuizLoadingStates({ 
    isLoading, 
    error, 
    hasObservations, 
    children 
}: QuizLoadingStatesProps) {
    if (isLoading && !hasObservations) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const isSpeciesCountError = error.message.includes('Not enough species found');
        
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Quiz Not Available</h2>
                    <p>{error.message}</p>
                    {isSpeciesCountError && (
                        <div style={{ marginTop: '1rem' }}>
                            <p>Try one of these options:</p>
                            <ul style={{ textAlign: 'left', display: 'inline-block' }}>
                                <li>Choose a larger geographic region</li>
                                <li>Start a quiz without location filtering</li>
                                <li>Try a different location with more snake diversity</li>
                            </ul>
                            <div style={{ marginTop: '1rem' }}>
                                <button 
                                    onClick={() => window.location.href = '/'}
                                    className={styles.homeButton}
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!hasObservations) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <p>Loading next question...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

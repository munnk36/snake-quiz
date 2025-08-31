import styles from './styles.module.scss';

interface LookalikeQuizLoadingStatesProps {
    isLoading: boolean;
    error: string | null;
    hasObservations: boolean;
    challengeTitle?: string;
    children: React.ReactNode;
}

export default function LookalikeQuizLoadingStates({ 
    isLoading, 
    error, 
    hasObservations, 
    challengeTitle,
    children 
}: LookalikeQuizLoadingStatesProps) {
    if (isLoading && !hasObservations) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <h2>Loading {challengeTitle || 'Challenge'}...</h2>
                    <p>Preparing your lookalike challenge...</p>
                </div>
            </div>
        );
    }

    if (error) {
        const handleGoHome = () => {
            window.location.href = '/';
        };

        const handleBackToModeSelect = () => {
            window.location.href = '/lookalike-mode-select';
        };

        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>Challenge Not Available</h2>
                    <p>{error}</p>
                    <div className={styles.actionButtons}>
                        <button onClick={handleBackToModeSelect} className={styles.backButton}>
                            Try Another Challenge
                        </button>
                        <button onClick={handleGoHome} className={styles.homeButton}>
                            Back to Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasObservations) {
        return (
            <div className={styles.container}>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <h2>Loading Question...</h2>
                    <p>Fetching observation data...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}

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
        return <div>Loading quiz...</div>;
    }

    if (error) {
        const isSpeciesCountError = error.message.includes('Not enough species found');
        
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '2rem', 
                maxWidth: '600px', 
                margin: '0 auto' 
            }}>
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
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (!hasObservations) {
        return <div>Loading next question...</div>;
    }

    return <>{children}</>;
}

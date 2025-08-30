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
        return <div>Error loading quiz: {error.message}</div>;
    }

    if (!hasObservations) {
        return <div>Loading next question...</div>;
    }

    return <>{children}</>;
}

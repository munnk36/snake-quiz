import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getLargeImageUrl } from '../../shared/utils/imageUtils';
import useQuizObservations from '../../services/api/hooks';
import { ObservationImage } from '../../shared/components';

export default function QuizPage() {
    const { quizId, placeId } = useParams();
    const navigate = useNavigate();
    const { 
        data, 
        isLoading, 
        error 
    } = useQuizObservations(10, quizId, placeId);

    useEffect(() => {
        if (!data || error) return;

        if (location.pathname.startsWith('/quiz/place/') && placeId) {
            navigate(`/quiz/${data.quizId}/${placeId}`, { replace: true });
        }
    }, [placeId, navigate, data, error]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isQuizComplete, setIsQuizComplete] = useState(false);

    if (isLoading) {
        return <div>Loading quiz...</div>;
    }

    if (error) {
        return <div>Error loading quiz</div>;
    }

    if (!data) {
        return <div>No quiz data available</div>;
    }

    const currentObservation = data.observations[currentQuestionIndex];

    const handleAnswer = (isVenomous: boolean) => {
        // This is where you'll implement the logic to check if the answer is correct
        // For now, let's just move to the next question
        if (currentQuestionIndex < data.observations.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            setIsQuizComplete(true);
        }
    };

    if (isQuizComplete) {
        return (
            <div>
                <h2>Quiz Complete!</h2>
                <p>Your score: {score} out of {data.observations.length}</p>
                <button onClick={() => navigate('/')}>Start New Quiz</button>
            </div>
        );
    }

    return (
        <div>
            <div>Question {currentQuestionIndex + 1} of {data.observations.length}</div>
            <div>Score: {score}</div>

            {currentObservation && (
                <div>
                    <ObservationImage
                        imageUrl={getLargeImageUrl(currentObservation.photos[0].url)}
                        observer={currentObservation.user.name || currentObservation.user.login}
                        observationId={currentObservation.id}
                        license={currentObservation.license_code}
                    />
                    <div>{currentObservation.place_guess}</div>
                    <div>
                        <button onClick={() => handleAnswer(true)}>Venomous</button>
                        <button onClick={() => handleAnswer(false)}>Non-venomous</button>
                    </div>
                </div>
            )}
        </div>
    );
};

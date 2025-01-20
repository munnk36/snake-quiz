import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useQuizObservations from '../../services/api/hooks';
import Quiz from './Quiz';

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

    if (isLoading) {
        return <div>Loading quiz...</div>;
    }

    if (error) {
        return <div>Error loading quiz: {error.message}</div>;
    }

    if (!data || data.observations.length !== 10) {
        return <div>Invalid quiz data - Need exactly 10 observations</div>;
    }

    return <Quiz observations={data.observations} />;
}

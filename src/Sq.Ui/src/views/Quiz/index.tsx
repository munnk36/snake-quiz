import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import useQuizObservations from '../../services/api/hooks';
import Quiz from './Quiz';

export default function QuizPage() {
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get('place');
    const quizId = searchParams.get('id');
    const navigate = useNavigate();
    const { 
        data, 
        isLoading, 
        error 
    } = useQuizObservations(10, quizId || '', placeId || '');
    
    useEffect(() => {
        if (!data || error) return;
    
        const needsRedirect = data.quizId && (
            !quizId ||
            quizId !== data.quizId
        );
    
        if (needsRedirect) {
            const newParams = new URLSearchParams();
            newParams.set('id', data.quizId);
            
            if (placeId) {
                newParams.set('place', placeId);
            }
    
            navigate({
                pathname: '/quiz',
                search: `?${newParams.toString()}`
            }, { 
                replace: true,
                state: { canonicalRedirect: true }
            });
        }
    }, [data, quizId, placeId, navigate, error]);
    
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

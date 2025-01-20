import { useState } from 'react';
import { Observation, QuizAnswer, QuizState } from '../../services/api/typeDefs';
import QuizQuestion from './QuizQuestion';
import styles from './styles.module.scss'
import QuizResults from './QuizResult';
import { getMediumImageUrl } from '../../shared/utils/imageUtils';

interface Props {
    observations: Observation[];
}

export default function QuizPage({observations}: Props) {
    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
    });

    const handleAnswer = (
        selectedTaxonId: number, 
        isCorrect: boolean,
        userAnswer: { preferredCommonName: string; scientificName: string }
    ) => {
        setQuizState(prev => {
            const currentObservation = observations[prev.currentQuestionIndex];
            
            const newAnswer: QuizAnswer = {
                observationId: currentObservation.id,
                selectedTaxonId,
                isCorrect,
                correctAnswer: {
                    preferredCommonName: currentObservation.taxon.preferred_common_name,
                    scientificName: currentObservation.taxon.name
                },
                userAnswer: {
                    preferredCommonName: userAnswer.preferredCommonName,
                    scientificName: userAnswer.scientificName
                },
                observationImageUrl: getMediumImageUrl(currentObservation.photos[0].url)
            };

            return {
                currentQuestionIndex: prev.currentQuestionIndex + 1,
                score: isCorrect ? prev.score + 1 : prev.score,
                answers: [...prev.answers, newAnswer]
            };
        });
    };

    if (quizState.currentQuestionIndex >= observations.length) {
        return (
            <QuizResults 
                answers={quizState.answers}
                score={quizState.score}
                totalQuestions={observations.length}
            />
        );
    }

    return (
        <div className={styles['quiz-wrapper']}>
            <div className={styles['quiz-progress']}>
                <div>Question {quizState.currentQuestionIndex + 1} of {observations.length}</div>
                <div>Score: {quizState.score}</div>
            </div>
            <div className={styles['quiz-question']}>
                <QuizQuestion
                    observation={observations[quizState.currentQuestionIndex]}
                    onAnswer={handleAnswer}
                />
            </div>
        </div>
    );
};
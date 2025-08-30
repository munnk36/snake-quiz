import styles from './styles.module.scss';
import { QuizProgressProps } from './types';

export default function QuizProgress({ 
    currentQuestion, 
    totalQuestions, 
    score 
}: QuizProgressProps) {
    return (
        <div className={styles['quiz-progress']}>
            <div>Question {currentQuestion} of {totalQuestions}</div>
            <div>Score: {score}</div>
        </div>
    );
}

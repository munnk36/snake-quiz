import styles from './styles.module.scss';

interface LookalikeQuizProgressProps {
    currentQuestion: number;
    totalQuestions: number;
    score: number;
}

export default function LookalikeQuizProgress({ 
    currentQuestion, 
    totalQuestions, 
    score 
}: LookalikeQuizProgressProps) {
    const percentage = ((currentQuestion - 1) / totalQuestions) * 100;

    return (
        <div className={styles.progressContainer}>
            <div className={styles.progressHeader}>
                <div>Question {currentQuestion} of {totalQuestions}</div>
                <div>Score: {score}</div>
            </div>
            <div className={styles.progressBar}>
                <div 
                    className={styles.progressFill}
                    style={{ width: `${Math.max(0, percentage)}%` }}
                ></div>
            </div>
        </div>
    );
}

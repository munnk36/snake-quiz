import { QuizAnswer } from '../../shared/constants';
import styles from './styles.module.scss';

interface Props {
    answers: QuizAnswer[];
    score: number;
    totalQuestions: number;
}

export default function QuizResults({
    answers,
    score,
    totalQuestions,
}: Props) {
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className={styles.container}>
            <div className={styles.scoreCard}>
                <h2>Quiz Results</h2>
                <div className={styles.scoreDisplay}>
                    <div className={styles.score}>{score} / {totalQuestions}</div>
                    <div className={styles.percentage}>{percentage}%</div>
                </div>
            </div>

            <div className={styles.answersGrid}>
                {answers.map((answer, index) => (
                    <div
                        key={answer.observationId}
                        className={`${styles.answerCard} ${answer.isCorrect ? styles.correct : styles.incorrect}`}
                    >
                        <div className={styles.questionNumber}>
                            Question {index + 1}
                        </div>

                        <div className={styles.imageContainer}>
                            <img
                                src={answer.observationImageUrl}
                                alt="Observation"
                                className={styles.observationImage}
                            />
                        </div>

                        <div className={styles.answerDetails}>
                            <div className={styles.userAnswer}>
                                <h4>Your Answer:</h4>
                                <div className={styles.commonName}>
                                    {answer.userAnswer.preferredCommonName}
                                </div>
                                <div className={styles.scientificName}>
                                    <i>{answer.userAnswer.scientificName}</i>
                                </div>
                            </div>

                            {!answer.isCorrect && (
                                <div className={styles.correctAnswer}>
                                    <h4>Correct Answer:</h4>
                                    <div className={styles.commonName}>
                                        {answer.correctAnswer.preferredCommonName}
                                    </div>
                                    <div className={styles.scientificName}>
                                        <i>{answer.correctAnswer.scientificName}</i>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={styles.resultIcon}>
                            {answer.isCorrect ? '✓' : '✕'}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

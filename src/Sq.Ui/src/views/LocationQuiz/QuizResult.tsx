import { useState } from 'react';
import styles from './styles.module.scss';
import { QuizResultsProps } from './types';
import { calculatePercentage, formatScore } from './utils';

export default function QuizResults({
    answers,
    score,
    totalQuestions,
}: QuizResultsProps) {
    const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
    const percentage = calculatePercentage(score, totalQuestions);
    const scoreText = formatScore(score, totalQuestions);

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopyStatus('copied');
            setTimeout(() => setCopyStatus('idle'), 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            setCopyStatus('error');
            setTimeout(() => setCopyStatus('idle'), 2000);
        }
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    const handleNewRound = () => {
        window.location.reload();
    };

    const getCopyButtonText = () => {
        switch (copyStatus) {
            case 'copied':
                return '✓ Link Copied!';
            case 'error':
                return '✕ Copy Failed';
            default:
                return '🔗 Share Quiz';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.scoreCard}>
                <h2>Quiz Results</h2>
                <div className={styles.scoreDisplay}>
                    <div className={styles.score}>
                        {scoreText}
                    </div>
                    <div className={styles.percentage}>
                        {percentage}%
                    </div>
                </div>

                <div className={styles.actionButtons}>
                    <div className={styles.shareSection}>
                        <button
                            onClick={handleCopyUrl}
                            className={`${styles.shareButton} ${styles[copyStatus]}`}
                            disabled={copyStatus !== 'idle'}
                        >
                            {getCopyButtonText()}
                        </button>
                        
                        <p className={styles.shareMessage}>
                            Challenge your friends with the same quiz!
                        </p>
                    </div>

                    <div className={styles.navigationButtons}>
                        <button
                            onClick={handleNewRound}
                            className={styles.newRoundButton}
                        >
                            🔄 New Round
                        </button>

                        <button
                            onClick={handleGoHome}
                            className={styles.homeButton}
                        >
                            🏠 Back to Home
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.answersGrid}>
                {answers.map((answer, index) => (
                    <div
                        key={answer.observationId}
                        className={`
                            ${styles.answerCard} 
                            ${answer.isCorrect ? styles.correct : styles.incorrect}
                        `}
                    >
                        <div className={styles.questionNumber}>
                            Question {index + 1}
                        </div>

                        <div className={styles.imageContainer}>
                            <a 
                                href={`https://www.inaturalist.org/observations/${answer.observationId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.observationLink}
                            >
                                <img
                                    src={answer.observationImageUrl}
                                    alt="Observation"
                                    className={styles.observationImage}
                                />
                            </a>
                        </div>

                        <div className={styles.answerDetails}>
                            <div className={styles.userAnswer}>
                                <h4>Your Answer:</h4>
                                {answer.userAnswer.preferredCommonName && (
                                    <div className={styles.commonName}>
                                        {answer.userAnswer.preferredCommonName}
                                    </div>
                                )}
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

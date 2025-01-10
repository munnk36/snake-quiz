
import { useNavigate } from 'react-router';
import styles from './styles.module.css';

export default function HomePage() {
    const navigate = useNavigate();

    const handleStartQuiz = () => {
        navigate('/quiz');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Snake ID Quiz</h1>
                <p className={styles.subtitle}>
                    Test your knowledge of snake species! Use real observations from iNaturalist
                    to learn about snakes in your area.
                </p>
                <button
                    className={styles.startButton}
                    onClick={handleStartQuiz}
                >
                    Start Quiz
                </button>
            </header>
        </div>
    );
};

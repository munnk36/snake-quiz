
import { useNavigate } from 'react-router';
import styles from './styles.module.css';
import { PlaceSearch } from '../../shared/components';

export default function HomePage() {
    const navigate = useNavigate();

    const startQuiz = (placeId?: string) => {
        if (placeId) {
            navigate(`/quiz/place/${placeId}`);
        } else {
            navigate('/quiz');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Snake ID Quiz</h1>
                <p className={styles.subtitle}>
                    Test your knowledge of snake species! Use real observations from iNaturalist
                    to learn about snakes in your area.
                </p>
                <PlaceSearch onPlaceSelect={(placeId) => startQuiz(placeId)} />
                <button
                    className={styles.startButton}
                    onClick={() => startQuiz()}
                >
                    Start Quiz
                </button>
            </header>
        </div>
    );
};

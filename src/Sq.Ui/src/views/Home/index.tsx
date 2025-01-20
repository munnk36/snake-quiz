
import { useNavigate } from 'react-router';
import styles from './styles.module.css';
import { PlaceSearch } from '../../shared/components';

export default function HomePage() {
    const navigate = useNavigate();

    const startQuiz = (placeId?: string) => {
        if (placeId) {
            navigate({
                pathname: '/quiz',
                search: `?place=${placeId}`
            });
        } else {
            navigate('/quiz');
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Scale Scout</h1>
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
            <footer className={styles.footer}>
                <div className={styles.footerLinks}>
                    <a 
                        href="https://github.com/munnk36/snake-quiz" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                    >
                        View on GitHub
                    </a>
                    <span className={styles.divider}>•</span>
                    <a 
                        href="https://www.inaturalist.org" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                    >
                        Powered by iNaturalist
                    </a>
                </div>
            </footer>
        </div>
    );
};

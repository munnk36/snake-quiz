
import { useNavigate } from 'react-router';
import styles from './styles.module.scss';
import { PlaceSearch } from '../../shared/components';

export default function HomePage() {
    const navigate = useNavigate();

    const startQuiz = (placeId?: string) => {
        if (placeId) {
            navigate({
                pathname: '/location-mode-select',
                search: `?place=${placeId}`
            });
        } else {
            navigate('/location-mode-select');
        }
    };

    const startLookalikeChallenge = () => {
        navigate('/lookalike-mode-select');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Scale Scout</h1>
                <p className={styles.subtitle}>
                    Test your knowledge of snake species! Use real observations from iNaturalist
                    to learn about snakes in your area.
                </p>
            </header>

            <main className={styles.main}>
                <div className={styles.quizSection}>
                    <h2 className={styles.sectionTitle}>Location-Based Quiz</h2>
                    <p className={styles.sectionDescription}>
                        Test your knowledge of snakes in a specific location, or leave blank for the entire world!
                    </p>
                    <PlaceSearch onPlaceSelect={(placeId) => startQuiz(placeId)} />
                    <button
                        className={styles.startButton}
                        onClick={() => startQuiz()}
                    >
                        Start Location Quiz
                    </button>
                </div>

                <div className={styles.quizSection}>
                    <h2 className={styles.sectionTitle}>Lookalike Challenges</h2>
                    <p className={styles.sectionDescription}>
                        Master the art of distinguishing between commonly confused snake species
                    </p>
                    <button
                        className={styles.challengeButton}
                        onClick={startLookalikeChallenge}
                    >
                        Browse Lookalike Challenges
                    </button>
                </div>
            </main>
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

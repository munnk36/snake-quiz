import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

export default function LocationModeSelectPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const placeId = searchParams.get('place');

    const startQuiz = (mode: 'multiple-choice' | 'scientific') => {
        const params = new URLSearchParams();
        params.set('mode', mode);
        if (placeId) {
            params.set('place', placeId);
        }
        
        navigate({
            pathname: '/quiz',
            search: params.toString()
        });
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Choose Your Challenge</h1>
                <p className={styles.subtitle}>
                    {placeId ? 'Quiz ready for your selected location!' : 'Global snake quiz ready!'}
                </p>
            </header>

            <div className={styles.modeGrid}>
                <div className={styles.modeCard}>
                    <h2>Multiple Choice</h2>
                    <p>Choose from 4 possible answers</p>
                    <ul className={styles.features}>
                        <li>Great for beginners</li>
                        <li>Learn common names</li>
                        <li>Process of elimination</li>
                    </ul>
                    <button
                        className={styles.modeButton}
                        onClick={() => startQuiz('multiple-choice')}
                    >
                        Start Multiple Choice
                    </button>
                </div>

                <div className={styles.modeCard}>
                    <h2>Scientific Mode</h2>
                    <p>Type the exact scientific name</p>
                    <ul className={styles.features}>
                        <li>Expert challenge</li>
                        <li>Learn scientific names</li>
                        <li>Spelling accuracy required</li>
                    </ul>
                    <button
                        className={styles.modeButton}
                        onClick={() => startQuiz('scientific')}
                    >
                        Start Scientific Mode
                    </button>
                </div>
            </div>

            <button 
                className={styles.backButton}
                onClick={() => navigate('/')}
            >
                ← Back to Location Selection
            </button>
        </div>
    );
}

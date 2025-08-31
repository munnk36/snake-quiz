import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { LOOKALIKE_CHALLENGES } from '../constants';

export default function LookalikeModeSelect() {
    const navigate = useNavigate();

    const handleChallengeSelect = (challengeId: string) => {
        navigate({
            pathname: '/lookalike-quiz',
            search: `?challenge=${challengeId}`
        });
    };

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Back to Home
                </button>
                <h1 className={styles.title}>Lookalike Challenges</h1>
                <p className={styles.subtitle}>
                    Test your skills with commonly confused snake species
                </p>
            </header>

            <div className={styles.challengeGrid}>
                {LOOKALIKE_CHALLENGES.map((challenge) => (
                    <div key={challenge.id} className={styles.challengeCard}>
                        <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                        <p className={styles.challengeDescription}>{challenge.description}</p>
                        
                        <div className={styles.challengeDetails}>
                            <div className={styles.speciesList}>
                                <h4>Species covered:</h4>
                                <ul>
                                    {challenge.species.map((species, index) => (
                                        <li key={index}>
                                            <em>{species.taxon_name}</em>
                                            {species.common_name && (
                                                <span> ({species.common_name})</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <div className={styles.region}>
                                <strong>Region:</strong> {challenge.region.name}
                            </div>
                            
                            {challenge.difficulty && (
                                <div className={styles.difficulty}>
                                    <strong>Difficulty:</strong> {challenge.difficulty}
                                </div>
                            )}
                        </div>

                        <button 
                            onClick={() => handleChallengeSelect(challenge.id)}
                            className={styles.startButton}
                        >
                            Start Challenge
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

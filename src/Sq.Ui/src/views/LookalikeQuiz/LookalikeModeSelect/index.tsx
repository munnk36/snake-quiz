import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';
import { LOOKALIKE_CHALLENGES } from '../constants';
import GuideModal from './GuideModal';

export default function LookalikeModeSelect() {
    const navigate = useNavigate();
    const [selectedGuide, setSelectedGuide] = useState<{ title: string; guide: string } | null>(null);

    const handleChallengeSelect = (challengeId: string) => {
        navigate({
            pathname: '/lookalike-quiz',
            search: `?challenge=${challengeId}`
        });
    };

    const handleBack = () => {
        navigate('/');
    };

    const handleShowGuide = (challenge: typeof LOOKALIKE_CHALLENGES[0]) => {
        if (challenge.guide) {
            setSelectedGuide({ title: challenge.title, guide: challenge.guide });
        }
    };

    const handleCloseGuide = () => {
        setSelectedGuide(null);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <button onClick={handleBack} className={styles.backButton}>
                    ← Back to Home
                </button>
                <h1 className={styles.title}>Lookalike Challenges</h1>
                <p className={styles.subtitle}>
                    Test your skills with commonly confused snake species!
                </p>
            </header>

            <div className={styles.challengeGrid}>
                {LOOKALIKE_CHALLENGES.map((challenge) => (
                    <div key={challenge.id} className={styles.challengeCard}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                            {challenge.guide && (
                                <button 
                                    onClick={() => handleShowGuide(challenge)}
                                    className={styles.guideButton}
                                    title="How to Tell Them Apart"
                                >
                                    📖 Guide
                                </button>
                            )}
                        </div>
                        
                        <p className={styles.challengeDescription}>{challenge.description}</p>
                        
                        <div className={styles.challengeDetails}>
                            <div className={styles.speciesList}>
                                <h4>Species covered:</h4>
                                <ul>
                                    {challenge.possibleAnswers.flatMap(group => 
                                        group.species.map((species, index) => (
                                            <li key={`${group.group_name}-${index}`} className={styles.speciesItem}>
                                                <div className={styles.speciesInfo}>
                                                    <em>{species.taxon_name}</em>
                                                    {species.common_name && (
                                                        <span> ({species.common_name})</span>
                                                    )}
                                                </div>
                                                <span className={`${styles.venomousLabel} ${species.venomous ? styles.venomous : styles.harmless}`}>
                                                    {species.venomous ? 'Dangerously Venomous' : 'Harmless'}
                                                </span>
                                            </li>
                                        ))
                                    )}
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

            <GuideModal 
                isOpen={!!selectedGuide}
                onClose={handleCloseGuide}
                title={selectedGuide?.title || ''}
                guide={selectedGuide?.guide || ''}
            />
        </div>
    );
}

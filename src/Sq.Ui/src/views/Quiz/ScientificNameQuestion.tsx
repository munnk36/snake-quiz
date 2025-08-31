import { useEffect, useState } from "react";
import { ObservationImage } from "../../shared/components";
import { getLargeImageUrl } from "../../shared/utils/imageUtils";
import styles from './styles.module.scss';
import { QuizQuestionProps } from './types';

export default function ScientificNameQuestion({ observation, onAnswer }: QuizQuestionProps) {
    const [userInput, setUserInput] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    // Reset state when observation changes
    useEffect(() => {
        setUserInput('');
        setShowResults(false);
        setIsCorrect(false);
    }, [observation.id]);

    const handleSubmit = () => {
        if (!userInput.trim() || showResults) return;

        const correctScientificName = observation.taxon.name.toLowerCase();
        const userAnswer = userInput.trim().toLowerCase();
        const correct = userAnswer === correctScientificName;
        
        setIsCorrect(correct);
        setShowResults(true);

        // Give the user a chance to see the result before next question
        setTimeout(() => {
            onAnswer(
                observation.taxon.id,
                correct,
                {
                    preferredCommonName: observation.taxon.preferred_common_name || observation.taxon.name,
                    scientificName: observation.taxon.name
                }
            );
        }, 2000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div className={styles['question-container']}>
            <ObservationImage
                imageUrl={getLargeImageUrl(observation.photos[0].url)}
                observer={observation.user.name || observation.user.login}
                observationId={observation.id}
                license={observation.license_code}
            />
            
            <div className={styles['location-info']}>
                {observation.place_guess}
            </div>

            <div className={styles['scientific-input-container']}>
                <label htmlFor="scientific-name">Enter the scientific name:</label>
                <input
                    id="scientific-name"
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="e.g., Crotalus atrox"
                    disabled={showResults}
                    autoComplete="off"
                />
                <button 
                    onClick={handleSubmit}
                    disabled={!userInput.trim() || showResults}
                >
                    Submit Answer
                </button>

                {showResults && (
                    <div className={`${styles['result-display']} ${isCorrect ? styles['correct'] : styles['incorrect']}`}>
                        {isCorrect ? (
                            <div>
                                <strong>Correct!</strong>
                                <p>{observation.taxon.name}</p>
                            </div>
                        ) : (
                            <div>
                                <strong>Incorrect</strong>
                                <p>Your answer: {userInput}</p>
                                <p>Correct answer: {observation.taxon.name}</p>
                            </div>
                        )}
                        {observation.taxon.preferred_common_name && (
                            <p>Common name: {observation.taxon.preferred_common_name}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

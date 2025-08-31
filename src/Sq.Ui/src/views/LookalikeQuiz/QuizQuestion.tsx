import { useEffect, useState } from "react";
import { ObservationImage } from "../../shared/components";
import { getLargeImageUrl } from "../../shared/utils/imageUtils";
import { useLookalikeQuizOptions } from "./hooks";
import LookalikeQuizOption from "./QuizOption";
import styles from './styles.module.scss';
import { LookalikeChallenge } from "./types";
import { Observation } from "../../services/api/typeDefs";

interface LookalikeQuizQuestionProps {
    challenge: LookalikeChallenge;
    observation: Observation;
    onAnswer: (
        selectedTaxonId: number,
        isCorrect: boolean,
        userAnswer: {
            preferredCommonName: string;
            scientificName: string;
        }
    ) => void;
}

interface LookalikeQuizOption {
    taxonId: number;
    scientificName: string;
    preferredCommonName: string;
    isCorrect: boolean;
}

export default function LookalikeQuizQuestion({ 
    challenge, 
    observation, 
    onAnswer 
}: LookalikeQuizQuestionProps) {
    const {
        quizOptions,
        isLoading: optionsLoading,
        error: optionsError
    } = useLookalikeQuizOptions(challenge, observation);

    const [selectedOption, setSelectedOption] = useState<LookalikeQuizOption | null>(null);
    const [showResults, setShowResults] = useState(false);

    // Reset state when observation changes
    useEffect(() => {
        setSelectedOption(null);
        setShowResults(false);
    }, [observation.id]);

    const handleSelect = (option: LookalikeQuizOption) => {
        if (selectedOption) return;

        setSelectedOption(option);
        setShowResults(true);

        // Give the user a chance to see the result before next question
        setTimeout(() => {
            onAnswer(
                option.taxonId,
                option.isCorrect,
                {
                    preferredCommonName: option.preferredCommonName,
                    scientificName: option.scientificName
                }
            );
        }, 1200);
    };

    if (optionsLoading) {
        return (
            <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Loading question options...</p>
            </div>
        );
    }

    if (optionsError) {
        return (
            <div className={styles.errorState}>
                <h3>Error loading options</h3>
                <p>{optionsError}</p>
            </div>
        );
    }

    if (!quizOptions.length) {
        return (
            <div className={styles.errorState}>
                <p>No options available for this question.</p>
            </div>
        );
    }

    return (
        <div className={styles.questionContainer}>
            <div className={styles.observationSection}>
                <ObservationImage
                    imageUrl={getLargeImageUrl(observation.photos[0].url)}
                    observer={observation.user.name || observation.user.login}
                    observationId={observation.id}
                    license={observation.license_code}
                />
                
                <div className={styles.locationInfo}>
                    {observation.place_guess}
                </div>
            </div>

            <div className={styles.questionSection}>
                <h3 className={styles.questionTitle}>
                    What species is this snake?
                </h3>
                
                <div className={styles.optionsGrid}>
                    {quizOptions.map((option) => (
                        <LookalikeQuizOption
                            key={option.taxonId}
                            option={option}
                            onSelect={handleSelect}
                            disabled={!!selectedOption}
                            isSelected={selectedOption?.taxonId === option.taxonId}
                            showResult={showResults}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

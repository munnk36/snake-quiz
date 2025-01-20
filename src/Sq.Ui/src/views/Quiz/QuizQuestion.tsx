import { useEffect, useState } from "react";
import { useQuizMultipleChoiceOptions } from "../../services/api/hooks";
import { Observation, QuizGuessOption } from "../../services/api/typeDefs";
import { ObservationImage } from "../../shared/components";
import { getLargeImageUrl } from "../../shared/utils/imageUtils";
import QuizOption from "./QuizOption";
import styles from './styles.module.scss';


interface Props {
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

export default function QuizQuestion({observation, onAnswer}: Props) {
    const {
        quizOptions,
        isLoading: optionsLoading,
        error: optionsError
    } = useQuizMultipleChoiceOptions(observation);

    const [selectedOption, setSelectedOption] = useState<QuizGuessOption | null>(null);
    const [showResults, setShowResults] = useState(false);
    
    useEffect(() => {
        setSelectedOption(null);
        setShowResults(false);
    }, [observation.id]);


    const handleSelect = (option: QuizGuessOption) => {
        if (selectedOption) return;
        
        setSelectedOption(option);
        setShowResults(true);
        
        setTimeout(() => {
            onAnswer(
                option.taxonId, 
                option.isCorrect,
                {
                    preferredCommonName: option.preferredCommonName,
                    scientificName: option.scientificName
                }
            );
        }, 1500);
    };
    
    if (optionsLoading) {
        return <div>Loading question options...</div>;
    }

    if (optionsError) {
        return <div>Error loading options: {optionsError.message}</div>;
    }

    return (
        <div className={styles['question-container']}>
            <ObservationImage
                imageUrl={getLargeImageUrl(observation.photos[0].url)}
                observer={observation.user.name || observation.user.login}
                observationId={observation.id}
                license={observation.license_code}
            />
            <div className={styles['location-info']}>{observation.place_guess}</div>
            
            <div className={styles['options-grid']}>
            {quizOptions.map((option) => (
                    <QuizOption
                        key={option.taxonId}
                        option={option}
                        onSelect={handleSelect}
                        disabled={showResults}
                        isSelected={selectedOption?.taxonId === option.taxonId}
                        showResult={showResults}
                    />
                ))}
            </div>
        </div>
    );
};
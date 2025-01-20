import { QuizGuessOption } from '../../services/api/typeDefs';
import styles from './styles.module.scss';

interface Props {
    option: QuizGuessOption;
    onSelect: (option: QuizGuessOption) => void;
    disabled?: boolean;
    isSelected?: boolean;
    showResult?: boolean;
}

export default function QuizOption({
    option,
    onSelect,
    disabled = false,
    isSelected = false,
    showResult = false,
}: Props) {
    const handleClick = () => {
        if (!disabled) {
            onSelect(option);
        }
    };

    const getStatusClass = () => {
        if (!showResult) return '';
        if (!isSelected) return '';
        return option.isCorrect ? styles.correct : styles.incorrect;
    };

    return (
        <button
        className={`
            ${styles['quiz-option']}
            ${isSelected ? styles.selected : ''}
            ${getStatusClass()}
            ${disabled ? styles.disabled : ''}
        `}
            onClick={handleClick}
            disabled={disabled}
            type="button"
            aria-pressed={isSelected}
        >
            <div className={styles['quiz-option-content']}>
                <div className={styles['common-name']}>
                    {option.preferredCommonName}
                </div>
                <div className={styles['scientific-name']}>
                    <i>{option.scientificName}</i>
                </div>
            </div>

            {showResult && isSelected && (
                <div className={styles['result-icon']} aria-hidden="true">
                    {option.isCorrect ? '✓' : '✕'}
                </div>
            )}
        </button>
    );
};

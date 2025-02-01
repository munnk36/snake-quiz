import { QuizGuessOption } from '../../shared/constants';
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
        if (showResult && isSelected) {
            return option.isCorrect ? styles.correct : styles.incorrect;
        }
        if (showResult && option.isCorrect) {
            return styles.correct;
        }
        return '';
    };

    const showResultIcon = showResult && (isSelected || option.isCorrect);

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

            {showResultIcon && (
                <div 
                    className={styles['resultIcon']}
                    aria-hidden="true"
                >
                    {option.isCorrect ? '✓' : '✕'}
                </div>
            )}
        </button>
    );
};

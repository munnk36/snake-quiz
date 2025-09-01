import styles from './styles.module.scss';
import { QuizOptionProps } from './types';

export default function QuizOption({
    option,
    onSelect,
    disabled = false,
    isSelected = false,
    showResult = false,
}: QuizOptionProps) {
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
                ${styles.option}
                ${isSelected ? styles.selected : ''}
                ${getStatusClass()}
                ${disabled ? styles.disabled : ''}
            `}
            onClick={handleClick}
            disabled={disabled}
            type="button"
            aria-pressed={isSelected}
        >
            <div className={styles.optionContent}>
                <div className={styles.commonName}>
                    {option.preferredCommonName}
                </div>
                <div className={styles.scientificName}>
                    <i>{option.scientificName}</i>
                </div>
            </div>

            {showResultIcon && (
                <div 
                    className={styles.resultIcon}
                    aria-hidden="true"
                >
                    {option.isCorrect ? '✓' : '✕'}
                </div>
            )}
        </button>
    );
}

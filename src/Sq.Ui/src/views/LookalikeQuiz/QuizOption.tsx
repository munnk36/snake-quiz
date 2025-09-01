import styles from './styles.module.scss';

interface LookalikeQuizOption {
    taxonId: number;
    scientificName: string;
    preferredCommonName: string;
    isCorrect: boolean;
    venomous: boolean;
}

interface LookalikeQuizOptionProps {
    option: LookalikeQuizOption;
    onSelect: (option: LookalikeQuizOption) => void;
    disabled?: boolean;
    isSelected?: boolean;
    showResult?: boolean;
}

export default function LookalikeQuizOption({
    option,
    onSelect,
    disabled = false,
    isSelected = false,
    showResult = false,
}: LookalikeQuizOptionProps) {
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
                    <em>{option.scientificName}</em>
                </div>
                <div className={`${styles.venomousLabel} ${option.venomous ? styles.venomous : styles.harmless}`}>
                    {option.venomous ? 'Dangerously Venomous' : 'Harmless'}
                </div>
            </div>
            {showResultIcon && (
                <div className={`${styles.resultIcon} ${option.isCorrect ? styles.correct : styles.incorrect}`}>
                    {option.isCorrect ? '✓' : (isSelected ? '✕' : '✓')}
                </div>
            )}
        </button>
    );
}

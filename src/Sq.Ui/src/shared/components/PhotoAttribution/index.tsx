import { V1_ENDPOINTS } from '../../../services/api/constants';
import styles from './styles.module.scss'

interface Props {
    observer: string;
    observationId: number;
    license: string;
    className?: string;
}

export default function PhotoAttribution({
    observer,
    observationId,
    license,
    className,
}: Props) {
    return (
        <div className={`${styles.attribution} ${className || ''}`}>
            <span className={styles.photoBy}>Photo by </span>
            <span className={styles.observer}>{observer}</span>
            <span className={styles.separator}>on</span>
            <a
                href={`https://www.inaturalist.org${V1_ENDPOINTS.OBSERVATIONS}/${observationId}`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
            >
                iNaturalist
            </a>
            {license &&
                <span className={styles.license}>({license})</span>
            }
        </div>
    );
} 

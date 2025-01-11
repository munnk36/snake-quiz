
import PhotoAttribution from '../PhotoAttribution';
import styles from './styles.module.css'

interface Props {
  imageUrl: string;
  observer: string;
  observationId: number;
  license: string;
  size?: number;
}

export default function ObservationImage({
  imageUrl,
  observer,
  observationId,
  license,
  size = 600,
}: Props) {
  return (
    <div
      className={styles.imageContainer}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt='Mystery Snake'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
          }}
          loading="lazy"
        />
      )}
      <PhotoAttribution
        observer={observer}
        observationId={observationId}
        license={license}
        className={styles.attribution}
      />
    </div>
  );
};


import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import PhotoAttribution from '../PhotoAttribution';
import styles from './styles.module.scss'

interface Props {
  imageUrl: string;
  observer: string;
  observationId: number;
  license: string;
}
const MAX_HEIGHT_VH = 40;

export default function ObservationImage({
  imageUrl,
  observer,
  observationId,
  license,
}: Props) {    
  const [isZoomed, setIsZoomed] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      if (containerRef.current) {
          containerRef.current.style.maxHeight = `${MAX_HEIGHT_VH}vh`;
      }
  }, []);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.target as HTMLImageElement;
      setIsPortrait(img.naturalHeight > img.naturalWidth);
  };


  return (
    <div className={styles.imageWrapper}>
      <div
        ref={containerRef}
        className={`${styles.imageContainer} ${isPortrait ? styles.imageContainerPortrait : ''
          }`}
        onClick={() => setIsZoomed(true)}
      >
        <img
          src={imageUrl}
          alt='Mystery Snake'
          className={styles.image}
          loading="lazy"
          onLoad={handleImageLoad}
        />
        <div className={styles.attributionWrapper}>
          <PhotoAttribution
            observer={observer}
            observationId={observationId}
            license={license}
            className={styles.attribution}
          />
        </div>
        <div className={styles.zoomHint}>
          <span>🔍 Tap to zoom</span>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            className={styles.zoomOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              className={styles.zoomedImageContainer}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
            >
              <img
                src={imageUrl}
                alt='Mystery Snake (Zoomed)'
                className={styles.zoomedImage}
              />
              <button
                className={styles.closeButton}
                onClick={() => setIsZoomed(false)}
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

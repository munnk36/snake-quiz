
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import PhotoAttribution from '../PhotoAttribution';
import styles from './styles.module.css'

interface Props {
  imageUrl: string;
  observer: string;
  observationId: number;
  license: string;
}

export default function ObservationImage({
  imageUrl,
  observer,
  observationId,
  license,
}: Props) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [maxHeight, setMaxHeight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate maximum height based on viewport
  useEffect(() => {
      const calculateMaxHeight = () => {
          if (!containerRef.current) return;
          
          const viewportHeight = window.innerHeight;
          const containerTop = containerRef.current.getBoundingClientRect().top;
          const padding = 40; // Space for attribution and padding
          
          setMaxHeight(viewportHeight - containerTop - padding);
      };

      calculateMaxHeight();
      window.addEventListener('resize', calculateMaxHeight);
      
      return () => window.removeEventListener('resize', calculateMaxHeight);
  }, []);

  return (
      <>
          <div 
              ref={containerRef}
              className={styles.imageWrapper}
              style={{ maxHeight: `${maxHeight}px` }}
          >
              <div 
                  className={styles.imageContainer}
                  onClick={() => setIsZoomed(true)}
              >
                  {imageUrl && (
                      <img
                          src={imageUrl}
                          alt='Mystery Snake'
                          className={styles.image}
                          loading="lazy"
                      />
                  )}
                  <PhotoAttribution
                      observer={observer}
                      observationId={observationId}
                      license={license}
                      className={styles.attribution}
                  />
                  <div className={styles.zoomHint}>
                      <span>🔍 Tap to zoom</span>
                  </div>
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
      </>
  );
};

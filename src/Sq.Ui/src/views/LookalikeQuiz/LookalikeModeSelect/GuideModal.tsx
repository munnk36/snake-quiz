import styles from './GuideModal.module.scss';

interface GuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    guide: string;
}

export default function GuideModal({ isOpen, onClose, title, guide }: GuideModalProps) {
    if (!isOpen) return null;

    const paragraphs = guide.split('\n\n').filter(p => p.trim());

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <header className={styles.header}>
                    <h2 className={styles.title}>How to Tell Them Apart</h2>
                    <h3 className={styles.subtitle}>{title}</h3>
                    <button className={styles.closeButton} onClick={onClose}>
                        ×
                    </button>
                </header>
                
                <div className={styles.content}>
                    <p className={styles.helpText}>
                        Use this guide to help you identify key characteristics. It's important to try to apply as many keys as possible; the more of these characteristics you can accurately identify, the more reliable your ID will be.
                    </p>
                    
                    {paragraphs.map((paragraph, index) => {
                        const [heading, ...content] = paragraph.split(': ');
                        return (
                            <div key={index} className={styles.section}>
                                <h4 className={styles.sectionTitle}>{heading}:</h4>
                                <p className={styles.sectionContent}>{content.join(': ')}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

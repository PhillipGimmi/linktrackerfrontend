import React, { useRef, useCallback } from 'react';
import styles from './MarqueeTextComponent.module.css';
import { audienceData } from '../hero/audienceData';
import useStore from '../../store/useStore';
import Head from 'next/head';
import { usePathname, useSearchParams } from 'next/navigation';

interface MarqueeTextComponentProps {
  setManualAudienceType: (type: string | null) => void;
}

const MarqueeTextComponent: React.FC<MarqueeTextComponentProps> = ({ setManualAudienceType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const setAudienceType = useStore((state) => state.setAudienceType);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleItemInteraction = useCallback(
    (index: number) => {
      const selectedAudience = audienceData[index];
      setAudienceType(selectedAudience.type);
      setManualAudienceType(selectedAudience.type);
      updateURL(selectedAudience.type);
    },
    [setAudienceType, setManualAudienceType, pathname, searchParams]
  );

  const updateURL = (newAudienceType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('audience', newAudienceType);
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  const renderMarqueeGroup = useCallback(
    (isReverse: boolean = false, isClone: boolean = false) => (
      <div
        className={styles.marquee__group}
        aria-hidden={isClone ? 'true' : 'false'}
      >
        {audienceData.map((item, index) => (
          <button
            key={`${item.type}${isReverse ? '-reverse' : ''}${isClone ? '-clone' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleItemInteraction(index);
            }}
            className={styles.marqueeItem}
            aria-label={`Select ${item.type}`}
            title={`View details for ${item.type}`}
            style={{
              '--hover-bg-color': `#${item.lightColors.directionalLight1Color
                .toString(16)
                .padStart(6, '0')}`,
              zIndex: 3, // Ensure buttons are above the background
            } as React.CSSProperties}
          >
            {item.type}
          </button>
        ))}
      </div>
    ),
    [handleItemInteraction]
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: audienceData.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.type,
      url: `/${item.type.toLowerCase().replace(/\s+/g, '-')}`,
    })),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>
      <section
        ref={containerRef}
        className={styles.marqueeContainer}
        aria-label="Audience selection marquee"
      >
        <h2 className="sr-only">Select Your Audience Type</h2>

        {/* Background Element with White Background */}
        <div className={styles.backgroundWrapper}></div>

        <div className={styles.wrapper}>
          <div className={styles.marquee} aria-hidden="true">
            {renderMarqueeGroup()}
            {renderMarqueeGroup(false, true)}
          </div>
          <div className={`${styles.marquee} ${styles.marqueeReverse}`} aria-hidden="true">
            {renderMarqueeGroup(true)}
            {renderMarqueeGroup(true, true)}
          </div>
        </div>
      </section>
    </>
  );
};

export default MarqueeTextComponent;

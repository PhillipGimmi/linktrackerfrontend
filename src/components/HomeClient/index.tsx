'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import WebGLParticleHead from '@/components/hero'; // Import the WebGLParticleHead component
import MarqueeTextComponent from '../MarqueeTextComponent';
import { DynamicParallaxContent } from '../DynamicParallaxContent';
import useStore from '../../store/useStore';

interface HomeClientProps {
  initialAudienceType: string;
}

const HomeClient: React.FC<HomeClientProps> = ({ initialAudienceType }) => {
  const { setAudienceType } = useStore();
  const pathname = usePathname();
  const router = useRouter();

  const [currentAudienceType, setCurrentAudienceType] = useState<string>(initialAudienceType);

  // Set the audience type based on the pathname
  useEffect(() => {
    const pathAudience = pathname.split('/')[1];
    const decodedAudience = pathAudience ? pathAudience.replace(/-/g, ' ') : initialAudienceType;
    setCurrentAudienceType(decodedAudience);
    setAudienceType(decodedAudience);
  }, [pathname, initialAudienceType, setAudienceType]);

  // Handle audience change from MarqueeTextComponent
  const handleAudienceChange = useCallback(
    (newAudience: string | null) => {
      if (newAudience) {
        setCurrentAudienceType(newAudience);
        setAudienceType(newAudience);
        const seoFriendlyUrl = `/${newAudience.toLowerCase().replace(/\s+/g, '-')}`;
        router.push(seoFriendlyUrl);
      }
    },
    [setAudienceType, router]
  );

  return (
    <div className="font-poppins">
      {/* Updated WebGLParticleHead to only pass the defaultAudienceType prop */}
      <WebGLParticleHead
        defaultAudienceType={currentAudienceType}
      />
      <section id="nextSection">
        <MarqueeTextComponent setManualAudienceType={handleAudienceChange} />
        <DynamicParallaxContent key={currentAudienceType} audienceType={currentAudienceType} />
      </section>
    </div>
  );
};

export default HomeClient;

// src/app/page.tsx
import HomeClient from '@/components/HomeClient';
import { audienceData } from '@/components/hero/audienceData';

interface HomePageProps {
  audienceType?: string;
}

// Render HomeClient and pass the audienceType (with a default value fallback)
export default function HomePage({ audienceType }: Readonly<HomePageProps>) {
  const initialAudienceType = audienceType ?? audienceData[0].type; // Default to the first audience type if none is provided
  
  return <HomeClient initialAudienceType={initialAudienceType} />;
}

import { notFound } from 'next/navigation';
import { audienceData } from '@/components/hero/audienceData';
import HomePage from '@/app/page';

interface AudiencePageProps {
  params: { audience: string };
}

// Helper function to normalize URL into a readable format for audience types
const decodeAudienceFromUrl = (urlSegment: string) => {
  return urlSegment.replace(/-/g, ' ').toLowerCase();
};

const AudiencePage = ({ params }: AudiencePageProps) => {
  const { audience } = params;

  // Decode the URL parameter to match with your audienceData
  const decodedAudience = decodeAudienceFromUrl(audience);

  // Find the valid audience in audienceData
  const validAudience = audienceData.find(
    (data) => data.type.toLowerCase() === decodedAudience
  );

  // If no valid audience is found, render a 404 page
  if (!validAudience) {
    return notFound();
  }

  // Render HomePage with the valid audience type
  return <HomePage audienceType={validAudience.type} />;
};

export default AudiencePage;

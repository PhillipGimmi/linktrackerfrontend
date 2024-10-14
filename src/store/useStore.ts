import { create } from 'zustand';
import { audienceData } from '../components/hero/audienceData';

interface StoreState {
  isHyperspeed: boolean;
  audienceType: string;
  setAudienceType: (audienceType: string) => void;
  toggleHyperspeed: () => void;
}

const useStore = create<StoreState>((set, get) => ({
  isHyperspeed: false,
  audienceType: audienceData[0].type,
  setAudienceType: (audienceType: string) => set({ audienceType }),
  toggleHyperspeed: () => {
    const { isHyperspeed, audienceType } = get();
    const currentAudienceIndex = audienceData.findIndex((audience) => audience.type === audienceType);
    const nextAudienceIndex = (currentAudienceIndex + 1) % audienceData.length;
    const nextAudienceType = audienceData[nextAudienceIndex].type;

    set({
      isHyperspeed: !isHyperspeed,
      audienceType: !isHyperspeed ? nextAudienceType : audienceType,
    });
  },
}));

export default useStore;

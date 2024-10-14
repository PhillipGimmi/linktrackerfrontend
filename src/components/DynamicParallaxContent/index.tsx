import React, { useEffect, useState, ReactNode } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import { audienceData, Audience } from "../hero/audienceData";
import { useSearchParams } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const MAX_IMAGE_HEIGHT = 400;

export const DynamicParallaxContent: React.FC = () => {
  const [currentAudience, setCurrentAudience] = useState<Audience | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const audienceFromUrl = searchParams.get("audience");
    const decodedAudience = decodeURIComponent(audienceFromUrl ?? "");

    const selectedAudience = audienceData.find((audience) => audience.type === decodedAudience);

    if (selectedAudience) {
      setCurrentAudience(selectedAudience);
    } else {
      setCurrentAudience(audienceData[0]);
    }
  }, [searchParams]);

  if (!currentAudience) {
    return null;
  }

  const isMobile = window.innerWidth <= 768;

  return (
    <div className="bg-white">
      {isMobile ? (
        <MobileSimpleContent imgUrl={currentAudience?.imgUrl ?? ""} featureText={currentAudience?.featureText ?? ""} />
      ) : (
        <TextParallaxContent imgUrl={currentAudience?.imgUrl ?? ""} featureText={currentAudience?.featureText ?? ""}>
          <FeatureContent audience={currentAudience} />
        </TextParallaxContent>
      )}
    </div>
  );
};

interface TextParallaxContentProps {
  imgUrl: string;
  featureText: string;
  children: ReactNode;
}

const TextParallaxContent: React.FC<TextParallaxContentProps> = ({ imgUrl, featureText, children }) => {
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const contentDiv = document.getElementById("content");
      if (contentDiv) {
        setContentHeight(contentDiv.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div>
      <div className="relative" style={{ height: `${contentHeight}px`, maxHeight: `${MAX_IMAGE_HEIGHT}px` }}>
        <StickyImage imgUrl={imgUrl} featureText={featureText} />
      </div>
      <AnimatedContent>{children}</AnimatedContent>
    </div>
  );
};

interface StickyImageProps {
  imgUrl: string;
  featureText: string;
}

const StickyImage: React.FC<StickyImageProps> = ({ imgUrl, featureText }) => {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);
  const width = useTransform(scrollYProgress, [0.5, 1], ["calc(50% - 24px)", "calc(100% - 48px)"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <motion.div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        maxHeight: `${MAX_IMAGE_HEIGHT}px`,
        height: "100%",
        width,
        borderRadius: "24px",
        margin: "0 auto",
        opacity,
        y,
      }}
      className="sticky z-0 overflow-hidden"
    >
      <motion.div className="absolute inset-0 bg-neutral-950/70" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        whileHover="hover"
      >
        <motion.div className="flex flex-wrap justify-center px-10">
          {featureText.split(" ").map((word) => (
            <ShiftWord word={word} key={uuidv4()} />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ShiftWord = ({ word }: { word: string }) => {
  return (
    <div className="inline-block h-[48px] md:h-[px] overflow-hidden text-4xl md:text-5xl font-bold text-white mx-1">
      <motion.span
        className="block relative"
        variants={{
          hover: {
            y: "-110%",
          },
        }}
        initial={{
          y: "0%",
        }}
        transition={{
          duration: 0.7,
        }}
      >
        <span className="block">{word}</span>
        <span className="block absolute top-full">{word}</span>
      </motion.span>
    </div>
  );
};

interface MobileSimpleContentProps {
  imgUrl: string;
  featureText: string;
}

const MobileSimpleContent: React.FC<MobileSimpleContentProps> = ({ imgUrl, featureText }) => {
    const [currentAudience, setCurrentAudience] = useState<Audience | null>(null);
    const searchParams = useSearchParams();
  
    useEffect(() => {
      const audienceFromUrl = searchParams.get("audience");
      const decodedAudience = decodeURIComponent(audienceFromUrl ?? "");
  
      const selectedAudience = audienceData.find((audience) => audience.type === decodedAudience);
  
      if (selectedAudience) {
        setCurrentAudience(selectedAudience);
      } else {
        setCurrentAudience(audienceData[0]);
      }
    }, [searchParams]);
  
    if (!currentAudience) {
      return null;
    }
  
    return (
      <div className="relative">
        <div
          style={{
            backgroundImage: `url(${imgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            margin: "0 auto",
            height: "250px",
            width: "90%",
            borderRadius:"15px",
            overflow: "hidden"
          }}
          className="relative"
        >
          <div className="absolute inset-0 bg-neutral-950/70 flex items-center justify-center">
            <div className="text-white text-xl font-bold text-center px-5">{featureText}</div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-center">Key Features and Benefits</h3>
          <FeatureContent audience={currentAudience} />
        </div>
      </div>
    );
  };

interface AnimatedContentProps {
  children: ReactNode;
}

const AnimatedContent: React.FC<AnimatedContentProps> = ({ children }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0.4, 1], [200, 0]);
  const opacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);

  return (
    <motion.div
      id="content"
      className="mx-auto max-w-[calc(100%-24px)]"
      style={{ y, opacity }}
    >
      {children}
    </motion.div>
  );
};

interface FeatureContentProps {
  audience: Audience;
}

const FeatureContent: React.FC<FeatureContentProps> = ({ audience }) => {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);

  useEffect(() => {
    setActiveFeatureIndex(0);
  }, [audience]);

  const handleToggleFeature = (index: number) => {
    setActiveFeatureIndex(index);
  };

  const activeFeature = audience.keyFeaturesAndBenefits[activeFeatureIndex];
  const activeFeatureDetail = audience.featureDetails[activeFeatureIndex];

  return (
    <div className="mx-auto max-w-[calc(100%-24px)] px-0 py-12 md:px-4">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="col-span-1 md:col-span-4 text-left">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Key Features and Benefits</h2>
          <ul className="pl-0">
            {audience.keyFeaturesAndBenefits.map((feature, index) => (
              <motion.li key={uuidv4()} className="mb-2">
                <motion.button
                  className={`w-full h-[60px] flex items-center justify-left px-4 cursor-pointer text-sm md:text-lg rounded-lg transition-all duration-300 ease-in-out ${
                    activeFeatureIndex === index ? `font-bold` : "font-normal"
                  }`}
                  style={{
                    background: activeFeatureIndex === index ? "#111111" : "#f0f0f0",
                    color: activeFeatureIndex === index ? "#ffffff" : "#000",
                    border: activeFeatureIndex === index ? "2px solid" : "none",
                  }}
                  onClick={() => handleToggleFeature(index)}
                  whileHover={{ scale: 1.05 }}
                >
                  {feature}
                </motion.button>
              </motion.li>
            ))}
          </ul>
        </div>

        <div className="col-span-1 md:col-span-8 text-left max-w-[calc(100%-24px)]">
          <AnimatePresence mode="wait">
            {activeFeatureDetail && (
              <motion.div
                key={activeFeatureIndex}
                className="mb-8"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                layout
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-2">{activeFeature}</h3>
                <p className="text-sm md:text-xl mb-4">{activeFeatureDetail.description}</p>
                <h4 className="text-lg md:text-xl font-semibold mb-2">Benefits:</h4>
                <ul className="pl-0 mb-4">
                  {activeFeatureDetail.benefits.map((benefit) => (
                    <li key={uuidv4()} className="mb-3">
                      <p className="font-semibold">{benefit.short}</p>
                      <p>{benefit.detailed}</p>
                    </li>
                  ))}
                </ul>
                <h4 className="text-lg md:text-xl font-semibold mb-2">Use Case:</h4>
                <p className="italic mb-4 text-sm md:text-base">{activeFeatureDetail.useCase}</p>
                <button className="w-full md:w-auto rounded bg-neutral-900 px-9 py-4 text-sm md:text-xl text-white transition-colors hover:bg-neutral-700">
                  {audience.ctaText} <FiArrowUpRight className="inline" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

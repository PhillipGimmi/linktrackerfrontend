import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { audienceData } from './audienceData';
import styles from './hero.module.css';
import { FaChevronDown } from 'react-icons/fa';
import { useSearchParams, usePathname } from 'next/navigation';

interface WebGLParticleHeadProps {
  defaultAudienceType: string;
}

interface Audience {
  type: string;
  lightColors: {
    directionalLight1Color: number;
    directionalLight2Color: number;
    pointLight1Color: number;
    pointLight2Color: number;
  };
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaUrl?: string;
}

const WebGLParticleHead: React.FC<WebGLParticleHeadProps> = ({ defaultAudienceType }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const mountRef = useRef<HTMLDivElement>(null);
  const hyperspeedRef = useRef(false);

  const [currentAudienceType, setCurrentAudienceType] = useState<string>('');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const urlAudience = searchParams.get('audience');
    if (urlAudience) {
      setCurrentAudienceType(decodeURIComponent(urlAudience.replace(/\+/g, ' ')));
    } else {
      setCurrentAudienceType(defaultAudienceType);
      updateURL(defaultAudienceType);
    }
  }, [searchParams, defaultAudienceType]);

  const currentAudience = audienceData.find(audience => audience.type === currentAudienceType) || audienceData[0];
  const { directionalLight1Color, directionalLight2Color, pointLight1Color, pointLight2Color } = currentAudience.lightColors;

  const colorToHex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;

  const updateURL = (newAudienceType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('audience', encodeURIComponent(newAudienceType));
    window.history.pushState(null, '', `${pathname}?${params.toString()}`);
  };

  const handleScrollToNextSection = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const nextSection = document.getElementById('nextSection');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const mountElement = mountRef.current;

    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let renderer: THREE.WebGLRenderer;
    let cylinder: THREE.Mesh;
    let texture: THREE.Texture;
    let light1: THREE.DirectionalLight;
    let light2: THREE.DirectionalLight;
    let pointLight1: THREE.PointLight;
    let pointLight2: THREE.PointLight;

    const normalSpeed = 0.0008;
    const hyperspeed = 60;
    const hyperspeedUpRatio = 1.03;
    const hyperspeedDownRatio = 1.3;
    let currentSpeed = normalSpeed;

    const hyperspeedUpScale = 1.03;
    const hyperspeedDownScale = 1.3;
    let currentScale = 1;

    const init = () => {
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      mountElement?.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 10000);
      camera.position.set(0, 0, 7);
      camera.lookAt(scene.position);
      scene.add(camera);

      light1 = new THREE.DirectionalLight(directionalLight1Color, 1);
      light1.position.set(1, 1, 0).normalize();
      scene.add(light1);

      light2 = new THREE.DirectionalLight(directionalLight2Color, 1);
      light2.position.set(-1, 1, 0).normalize();
      scene.add(light2);

      pointLight1 = new THREE.PointLight(pointLight1Color, 10, 25);
      pointLight1.position.set(0, -3, 0);
      scene.add(pointLight1);

      pointLight2 = new THREE.PointLight(pointLight2Color, 15, 30);
      pointLight2.position.set(3, 3, 0);
      scene.add(pointLight2);

      scene.fog = new THREE.FogExp2(0x000000, 0.2);

      texture = new THREE.TextureLoader().load('./water.jpg', undefined, undefined, () => {});
      texture.wrapT = THREE.RepeatWrapping;
      texture.wrapS = THREE.RepeatWrapping;

      const material = new THREE.MeshLambertMaterial({
        color: 0xffffff,
        opacity: 1,
        map: texture,
      });
      const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 30, 32, 1, true);

      cylinder = new THREE.Mesh(cylinderGeometry, material);
      material.side = THREE.BackSide;
      cylinder.rotation.x = Math.PI / 2;
      scene.add(cylinder);
    };

    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      render();
    };

    const render = () => {
      if (hyperspeedRef.current) {
        currentSpeed = currentSpeed >= hyperspeed ? hyperspeed : currentSpeed * hyperspeedUpRatio;
        currentScale = currentScale <= 0.2 ? 0.2 : currentScale / hyperspeedUpScale;
      } else {
        currentSpeed = currentSpeed <= 1 ? 1 : currentSpeed / hyperspeedDownRatio;
        currentScale = currentScale >= 1 ? 1 : currentScale * hyperspeedDownScale;
      }
      cylinder.scale.set(currentScale, 1, currentScale);
      texture.offset.y -= normalSpeed * currentSpeed;
      texture.offset.y %= 1;
      texture.needsUpdate = true;

      const seconds = Date.now() / 1000;
      const angle = 0.2 * seconds;
      camera.rotation.z = angle;

      renderer.render(scene, camera);
    };

    const updateLights = (newAudience: Audience) => {
      light1.color.setHex(newAudience.lightColors.directionalLight1Color);
      light2.color.setHex(newAudience.lightColors.directionalLight2Color);
      pointLight1.color.setHex(newAudience.lightColors.pointLight1Color);
      pointLight2.color.setHex(newAudience.lightColors.pointLight2Color);

      renderer.render(scene, camera);
    };

    const handleMouseDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (
        !mountRef.current?.contains(target) || // Ensure click is within the component
        target.closest('.scrollChevron') || // Ignore scrollChevron clicks
        target.closest('.ctaButton') // Ignore CTA button clicks
      )
        return;
      
      setIsFading(true);
      hyperspeedRef.current = true;
    };

    const handleMouseUp = (event: MouseEvent | TouchEvent) => {
      const target = event.target as HTMLElement;
      if (
        !mountRef.current?.contains(target) || // Ensure release is within the component
        target.closest('.scrollChevron') || // Ignore scrollChevron clicks
        target.closest('.ctaButton') // Ignore CTA button clicks
      )
        return;

      hyperspeedRef.current = false;

      const currentAudienceIndex = audienceData.findIndex(audience => audience.type === currentAudienceType);
      const nextAudienceIndex = (currentAudienceIndex + 1) % audienceData.length;
      const nextAudience = audienceData[nextAudienceIndex];

      updateLights(nextAudience);
      setCurrentAudienceType(nextAudience.type);
      updateURL(nextAudience.type);

      setTimeout(() => {
        setIsFading(false);
      }, 200);
    };

    if (typeof window !== 'undefined') {
      init();
      animate();
      window.addEventListener('resize', onWindowResize);
      mountElement?.addEventListener('mousedown', handleMouseDown);
      mountElement?.addEventListener('touchstart', handleMouseDown);
      mountElement?.addEventListener('mouseup', handleMouseUp);
      mountElement?.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onWindowResize);
        mountElement?.removeEventListener('mousedown', handleMouseDown);
        mountElement?.removeEventListener('touchstart', handleMouseDown);
        mountElement?.removeEventListener('mouseup', handleMouseUp);
        mountElement?.removeEventListener('touchend', handleMouseUp);
      }
      mountElement?.removeChild(renderer?.domElement);
    };
  }, [directionalLight1Color, directionalLight2Color, pointLight1Color, pointLight2Color, currentAudienceType]);

  return (
    <div ref={mountRef} className={styles.heroWrapper} aria-label="3D WebGL particle animation with changing audience type">
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isFading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
        className={styles.heroContent}
        aria-live="polite"
      >
        <div style={{ maxWidth: '400px', textAlign: 'left', margin: '0 auto', color: 'white' }}>
          <motion.h1
            style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 'bold' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentAudience.headline.split(' ').map((word, index) => (
              <React.Fragment key={`${word}-${index}`}>
                <span>{word}</span>
                {index < currentAudience.headline.split(' ').length - 1 && ' '}
              </React.Fragment>
            ))}
          </motion.h1>
          <motion.p
            style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {currentAudience.subheadline.split(' ').map((word, index) => (
              <React.Fragment key={`${word}-${index}`}>
                <span>{word}</span>
                {index < currentAudience.subheadline.split(' ').length - 1 && ' '}
              </React.Fragment>
            ))}
          </motion.p>

          {currentAudience.ctaText && currentAudience.ctaUrl && (
            <motion.a
                href={currentAudience.ctaUrl}
                className={`${styles.ctaButton} ctaButton`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                    backgroundColor: 'transparent',
                    borderColor: colorToHex(currentAudience.lightColors.directionalLight1Color),
                    color: colorToHex(currentAudience.lightColors.directionalLight1Color),
                    borderWidth: '2px',  // Add border width
                    borderStyle: 'solid',  // Ensure it's a solid border
                }}
                whileHover={{
                    boxShadow: `0 0 10px 3px ${colorToHex(currentAudience.lightColors.directionalLight1Color)}, 
                                0 0 20px 6px ${colorToHex(currentAudience.lightColors.directionalLight1Color)}`,
                    backgroundColor: 'transparent',
                }}
                aria-label={currentAudience.ctaText}
            >
                {currentAudience.ctaText}
            </motion.a>

          )}
        </div>
      </motion.div>
      <div className={`${styles.remark} scrollChevron`} aria-live="assertive" aria-label="Scroll to next section">
        <FaChevronDown 
          size={30} 
          color={colorToHex(currentAudience.lightColors.directionalLight1Color)} 
          aria-hidden="true" 
          onClick={handleScrollToNextSection} 
        />
      </div>
    </div>
  );
};

export default WebGLParticleHead;

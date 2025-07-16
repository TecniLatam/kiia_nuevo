"use client";

import { useCallback, useState, useEffect } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";

export function ParticlesBackground() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: isMobile ? 60 : 120,
        interactivity: {
          events: {
            onClick: {
              enable: !isMobile,
              mode: "push",
            },
            onHover: {
              enable: !isMobile,
              mode: "repulse",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: isMobile ? 2 : 4,
            },
            repulse: {
              distance: isMobile ? 50 : 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: "var(--primary)",
          },
          links: {
            color: "var(--primary)",
            distance: isMobile ? 100 : 150,
            enable: true,
            opacity: isMobile ? 0.1 : 0.2,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: isMobile ? 0.5 : 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: isMobile ? 600 : 800,
            },
            value: isMobile ? 40 : 80,
          },
          opacity: {
            value: isMobile ? 0.15 : 0.2,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: isMobile ? 2 : 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
} 
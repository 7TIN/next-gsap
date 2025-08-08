"use client";

// Import useLayoutEffect
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollVideoFrames() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // We need a ref for the main component container to scope the context
  const mainRef = useRef<HTMLDivElement | null>(null);

  const frameCount = 240;
  const imageSeq = { frame: 0 };

  const currentFrame = (index: number) =>
    `/frames/frame-0_${String(index + 1).padStart(5, "0")}.png`;

  // No changes to preloadImages or renderFrame...
  const preloadImages = (
    imageElements: React.MutableRefObject<HTMLImageElement[]>
  ): Promise<void> => {
    return new Promise((resolve) => {
      let loadedImages = 0;
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
          loadedImages++;
          if (loadedImages === frameCount) {
            resolve();
          }
        };
        imageElements.current.push(img);
      }
    });
  };

  useLayoutEffect(() => {
    // 1. Create a GSAP context
    const context = gsap.context(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context2d = canvas.getContext("2d");
      if (!context2d) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const images: HTMLImageElement[] = [];
      const imageElementsRef = { current: images };

      await preloadImages(imageElementsRef);

      const renderFrame = () => {
        const img = images[imageSeq.frame];
        if (!img || !img.complete) return;

        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const x = canvas.width / 2 - (img.width / 2) * scale;
        const y = canvas.height / 2 - (img.height / 2) * scale;

        context2d.clearRect(0, 0, canvas.width, canvas.height);
        context2d.drawImage(img, x, y, img.width * scale, img.height * scale);
      };

      images[0].onload = renderFrame;
      renderFrame();

      gsap.to(imageSeq, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          scrub: 0.5,
          trigger: canvas,
          start: "top top",
          end: "+=3000",
          pin: true,
        },
        onUpdate: renderFrame,
      });
    }, mainRef); // <-- Scope the context to the main element

    // 2. Return a cleanup function that REVERTS the context
    return () => context.revert();
  }, []); // Empty dependency array ensures this runs only once

  return (
    // Add the ref to the main container
    <div ref={mainRef}>
      <canvas ref={canvasRef} className="w-full h-screen" />
      <div style={{ height: "100vh", background: "white" }}>
        <h1 style={{ textAlign: "center", paddingTop: "50px" }}>
          Content After Scroll Animation
        </h1>
      </div>
    </div>
  );
}
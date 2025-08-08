"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function AnimatedHero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mainRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const frameCount = 240;
  const imageSeq = { frame: 0 };

  const currentFrame = (index: number) =>
    `/frames/frame-0_${String(index + 1).padStart(5, "0")}.png`;

  const preloadImages = (): Promise<HTMLImageElement[]> => {
    return new Promise((resolve) => {
      const images: HTMLImageElement[] = [];
      let loadedImages = 0;
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.src = currentFrame(i);
        img.onload = () => {
          loadedImages++;
          if (loadedImages === frameCount) {
            resolve(images);
          }
        };
        images.push(img);
      }
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const images = await preloadImages();

      const renderFrame = () => {
        const img = images[imageSeq.frame];
        if (!img || !img.complete) return;

        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const scale = Math.max(
          canvas.width / img.width,
          canvas.height / img.height
        );
        // ** FIX: Use 'scale' instead of 'ratio' **
        const x = (canvas.width - img.width * scale) / 2;
        const y = (canvas.height - img.height * scale) / 2;

        context.drawImage(
          img, 0, 0, img.width, img.height,
          x, y, img.width * scale, img.height * scale
        );
      };

      renderFrame();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "+=3000",
          scrub: 1,
          pin: true,
        },
      });

      tl
        .to([heroRef.current, navRef.current], {
            opacity: 0,
            duration: 0.5,
          }, 0
        )
        .to(imageSeq, {
            frame: frameCount - 1,
            snap: "frame",
            ease: "none",
            onUpdate: renderFrame,
          }, 0
        )
        .to(navRef.current, {
            opacity: 0,
            color: "#000",
            duration: 0.5,
          }, ">-0.5"
        );

    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mainRef} className="relative">
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-transparent text-black"
      >
        <div className="font-bold text-lg">Prasadev</div>
        <div className="flex space-x-6">
          <a href="#">Products</a>
          <a href="#">Pricing</a>
          <a href="#">Blog</a>
        </div>
        <div className="flex space-x-4 ">
          <button className="px-4 py-2 rounded-full border border-black">
            Watch Demo
          </button>
          <button className="px-4 py-2 rounded-full border border-black">
            Start for Free
          </button>
        </div>
      </nav>

      <section
        ref={heroRef}
        className="absolute inset-0 w-full h-screen flex flex-col justify-center items-center text-center text-white z-40 pointer-events-none"
      >
        <h1 className="text-4xl md:text-6xl font-semibold max-w-3xl">
          The single platform to iterate, evaluate, deploy, and monitor LLMs
        </h1>
        <div className="mt-8 flex flex-wrap justify-center items-center gap-x-8 gap-y-4 opacity-80">
          <span>McKinsey & Company</span>
          <span>15five</span>
          <span>serif</span>
          <span>salesforce</span>
          <span>Daybreak</span>
          <span>Hubspot</span>
        </div>
      </section>

      <canvas ref={canvasRef} className="w-full h-screen relative z-10" />

      <div className="h-screen bg-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Hi, There
        </h1>
      </div>
    </div>
  );
}
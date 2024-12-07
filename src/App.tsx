import { useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef } from "react";

function App() {
  const ref = useRef<HTMLCanvasElement>(null);

  // Scroll progress based on the canvas container
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["center end", "end center"],
  });

  const totalFrames = 720; // Total frames for the video
  const images = useMemo(() => {
    const loadedImages: HTMLImageElement[] = [];

    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = `/images/${i}.webp`;
      loadedImages.push(img);
    }

    return loadedImages;
  }, [totalFrames]);

  const render = useCallback(
    (index: number) => {
      if (images[index - 1]) {
        const canvas = ref.current;
        const ctx = canvas?.getContext("2d");

        if (ctx && canvas) {
          const img = images[index - 1];
          // Adjust canvas to fill screen width while maintaining aspect ratio
          const aspectRatio = img.width / img.height;
          const canvasWidth = window.innerWidth;
          const canvasHeight = canvasWidth / aspectRatio;

          canvas.width = canvasWidth;
          canvas.height = canvasHeight;

          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
        }
      }
    },
    [images]
  );

  // Further slow down the scroll speed by reducing the scaling factor (e.g., 0.2)
  const slowScrollProgress = useTransform(
    scrollYProgress,
    [0, 1],
    [0, totalFrames * 0.1]
  );

  const currentIndex = useTransform(
    slowScrollProgress,
    [0, totalFrames * 0.1],
    [1, totalFrames]
  );

  useMotionValueEvent(currentIndex, "change", (latest) => {
    render(Number(latest.toFixed()));
  });

  useEffect(() => {
    render(1); // Render the first frame on mount

    // Adjust canvas size on window resize
    const handleResize = () => render(1);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [render]);

  return (
    <div
      style={{
        height: "1000px",
        backgroundColor: "white",
      }}
    >
      <div style={{ height: "1500px" }} />
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <canvas ref={ref} style={{ display: "block", width: "100%" }} />
      </div>
      <div style={{ height: "1500px" }} />
    </div>
  );
}

export default App;

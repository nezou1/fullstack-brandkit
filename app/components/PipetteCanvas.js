"use client";

import { useState, useRef, useEffect } from "react";
import { T } from "../lib/i18n";
import { getPixelColor } from "../lib/utils";

export default function PipetteCanvas({ imageSrc, colors, onColorsChange, lang }) {
  const t = T[lang];
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [pipettes, setPipettes] = useState([]);
  const [dragging, setDragging] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const container = containerRef.current;
      if (!container) return;
      const maxW = container.clientWidth;
      const ratio = img.height / img.width;
      const w = Math.min(img.width, maxW);
      const h = w * ratio;
      canvas.width = w;
      canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      setImageLoaded(true);
      const positions = [];
      for (let i = 0; i < 5; i++) {
        positions.push({ x: Math.round((w * (i + 1)) / 6), y: Math.round(h / 2) });
      }
      setPipettes(positions);
      const newColors = positions.map((p) => getPixelColor(canvas, p.x, p.y));
      onColorsChange(newColors);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: Math.round(Math.max(0, Math.min(canvas.width, ((clientX - rect.left) / rect.width) * canvas.width))),
      y: Math.round(Math.max(0, Math.min(canvas.height, ((clientY - rect.top) / rect.height) * canvas.height))),
    };
  };

  const handleDown = (e, idx) => { e.preventDefault(); setDragging(idx); };

  useEffect(() => {
    if (dragging === null) return;
    const handleMove = (e) => {
      e.preventDefault();
      const coords = getCanvasCoords(e);
      setPipettes((prev) => { const next = [...prev]; next[dragging] = coords; return next; });
      const canvas = canvasRef.current;
      if (canvas) {
        const color = getPixelColor(canvas, coords.x, coords.y);
        onColorsChange((prev) => { const next = [...prev]; next[dragging] = color; return next; });
      }
    };
    const handleUp = () => setDragging(null);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); window.removeEventListener("touchmove", handleMove); window.removeEventListener("touchend", handleUp); };
  }, [dragging, onColorsChange]);

  return (
    <div ref={containerRef} className="relative mt-4 rounded-xl overflow-hidden border border-gray-200">
      <canvas ref={canvasRef} className="block w-full" style={{ cursor: dragging !== null ? "grabbing" : "default" }} />
      {imageLoaded && pipettes.map((p, i) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const left = (p.x / canvas.width) * 100;
        const top = (p.y / canvas.height) * 100;
        return (
          <div key={i} onMouseDown={(e) => handleDown(e, i)} onTouchStart={(e) => handleDown(e, i)}
            className="absolute flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
            style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)", width: 32, height: 32, zIndex: dragging === i ? 20 : 10 }}>
            <div className="absolute inset-0 rounded-full border-2 border-white shadow-lg" style={{ background: colors[i] || "#ccc" }} />
            <span className="relative text-white text-xs font-bold drop-shadow-md">{i + 1}</span>
          </div>
        );
      })}
      {imageLoaded && <p className="text-xs text-gray-400 text-center py-2 bg-gray-50">{t.pipetteHint}</p>}
    </div>
  );
}

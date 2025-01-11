'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';

const CAT_IMAGES = [
  '/catMeme1.png',
  '/catMeme2.png',
  '/catMeme3.png',
  '/catMeme4.png',
  '/catMeme5.png',
  '/catMeme6.png',
  '/catMeme7.png',
  '/catMeme8.png',
];

interface Cat {
  id: number;
  x: number;
  y: number;
  velocityY: number;
  velocityX: number;
  rotation: number;
  rotationVelocity: number;
  imageIndex: number;
  scale: number;
  bounceCount: number;
  isDragging: boolean;
  shakeOffset: { x: number; y: number };
}

export default function BouncingCats({ catCount }: { catCount: number }) {
  const [cats, setCats] = useState<Cat[]>([]);
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 });
  const [draggedCat, setDraggedCat] = useState<number | null>(null);

  const createCat = useCallback(
    () => ({
      id: Math.random(),
      x: Math.random() * (windowSize.width - 80),
      y: -100,
      velocityY: Math.random() * 2 + 1,
      velocityX: (Math.random() - 0.5) * 6,
      rotation: Math.random() * 360,
      rotationVelocity: (Math.random() - 0.5) * 15,
      imageIndex: Math.floor(Math.random() * CAT_IMAGES.length),
      scale: 0.8 + Math.random() * 0.4,
      bounceCount: 0,
      isDragging: false,
      shakeOffset: { x: 0, y: 0 },
    }),
    [windowSize.width]
  );

  useEffect(() => {
    if (cats.length < catCount) {
      setCats((prev) => [...prev, createCat()]);
    }
  }, [catCount, cats.length, createCat]);

  const animate = useCallback(
    (time: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      const deltaTime = Math.min((time - lastTimeRef.current) / 16, 2);
      lastTimeRef.current = time;

      setCats((prevCats) =>
        prevCats.map((cat) => {
          const gravity = 0.6 * deltaTime;
          const newVelocityY = cat.velocityY + gravity;
          const newY = cat.y + newVelocityY * deltaTime;
          const newRotation = ((cat.rotation + cat.rotationVelocity * deltaTime) % 360 + 360) % 360; // Keep rotation between 0-360
          const newX = cat.x + cat.velocityX * deltaTime;

          const velocityX = newX < 0 || newX > windowSize.width - 80 ? -cat.velocityX * 0.7 : cat.velocityX;
          const rotationVelocity =
            newX < 0 || newX > windowSize.width - 80 ? cat.rotationVelocity * 0.8 : cat.rotationVelocity;

          const velocityY =
            newY < 0 || newY > windowSize.height - 80 ? -newVelocityY * 0.7 : newVelocityY;

          const shakeOffset = cat.isDragging
            ? { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 }
            : { x: 0, y: 0 };

          return {
            ...cat,
            x: newX < 0 ? 0 : newX > windowSize.width - 80 ? windowSize.width - 80 : newX,
            y: newY < 0 ? 0 : newY > windowSize.height - 80 ? windowSize.height - 80 : newY,
            velocityX: cat.isDragging ? 0 : velocityX,
            velocityY: cat.isDragging ? 0 : velocityY,
            rotation: newRotation,
            rotationVelocity,
            shakeOffset,
          };
        })
      );

      requestRef.current = requestAnimationFrame(animate);
    },
    [windowSize]
  );

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate]);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - 72,
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseDown = (e: React.MouseEvent, catId: number) => {
    setDraggedCat(catId);
    setCats((prev) =>
      prev.map((cat) => (cat.id === catId ? { ...cat, isDragging: true } : cat))
    );
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedCat === null) return;
    setCats((prev) =>
      prev.map((cat) =>
        cat.id === draggedCat
          ? {
              ...cat,
              x: e.clientX - 40,
              y: e.clientY - 40,
            }
          : cat
      )
    );
  };

  const handleMouseUp = () => {
    setDraggedCat(null);
    setCats((prev) =>
      prev.map((cat) => (cat.id === draggedCat ? { ...cat, isDragging: false } : cat))
    );
  };

  return (
    <div
      className="fixed inset-0 z-20 overflow-hidden pt-[72px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cats.map((cat) => (
        <div
          key={cat.id}
          className="absolute will-change-transform cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${cat.x + cat.shakeOffset.x}px, ${cat.y + cat.shakeOffset.y}px) 
                        rotate(${cat.rotation}deg) scale(${cat.scale})`,
          }}
          onMouseDown={(e) => handleMouseDown(e, cat.id)}
        >
          <Image
            src={CAT_IMAGES[cat.imageIndex]}
            alt="Bouncing Cat"
            width={100}
            height={100}
            className="select-none"
            priority
          />
        </div>
      ))}
    </div>
  );
}

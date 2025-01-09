'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

// Define cat image URLs - using placeholder images since we don't have access to the actual cat memes
const CAT_IMAGES = [
  '/catMeme1.png',
  '/catMeme2.png',
  '/catMeme3.png',
  '/catMeme4.png',
  '/catMeme5.png',
  '/catMeme6.png',
  '/catMeme7.png',
  '/catMeme8.png'
]

interface Cat {
  id: number
  x: number
  y: number
  velocityY: number
  velocityX: number
  rotation: number
  rotationVelocity: number
  imageIndex: number
  scale: number
  bounceCount: number
  isDragging: boolean
  shakeOffset: { x: number; y: number }
}

export default function BouncingCats({ catCount }: { catCount: number }) {
  const [cats, setCats] = useState<Cat[]>([])
  const requestRef = useRef<number | null>(null)  // Fixed: Initialize with null
  const lastTimeRef = useRef<number | null>(null)  // Fixed: Initialize with null
  const [windowSize, setWindowSize] = useState({ width: 800, height: 600 }) // Default size
  const [draggedCat, setDraggedCat] = useState<number | null>(null)

  const createCat = () => ({
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
    shakeOffset: { x: 0, y: 0 }
  })

  const animate = (time: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
      return
    }

    const deltaTime = Math.min((time - lastTimeRef.current) / 16, 2)
    lastTimeRef.current = time

    setCats(prevCats => {
      return prevCats.map(cat => {
        const gravity = 0.6 * deltaTime
        let newVelocityY = cat.velocityY + gravity
        let newY = cat.y + newVelocityY * deltaTime
        let newRotation = cat.rotation + cat.rotationVelocity * deltaTime
        let newX = cat.x + cat.velocityX * deltaTime
        const newBounceCount = cat.bounceCount

        // Bounce off all walls with energy loss
        if (newX < 0) {
          newX = 0
          cat.velocityX = Math.abs(cat.velocityX) * 0.7
          cat.rotationVelocity *= 0.8
        } else if (newX > windowSize.width - 80) {
          newX = windowSize.width - 80
          cat.velocityX = -Math.abs(cat.velocityX) * 0.7
          cat.rotationVelocity *= 0.8
        }

        // Add top wall collision
        if (newY < 0) {
          newY = 0
          newVelocityY = Math.abs(newVelocityY) * 0.7
          cat.rotationVelocity *= 0.8
        }
        // Bottom wall collision (already existing, but modified for consistency)
        else if (newY > windowSize.height - 80) {
          newY = windowSize.height - 80
          newVelocityY = -Math.abs(newVelocityY) * 0.7
          cat.rotationVelocity *= 0.8
          cat.velocityX *= 0.9
        }

        // Keep rotation between 0-360
        newRotation = ((newRotation % 360) + 360) % 360

        // Add shake effect when dragging
        const shakeOffset = cat.isDragging ? {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8
        } : { x: 0, y: 0 }

        // Check collisions with other cats
        prevCats.forEach(otherCat => {
          if (cat.id !== otherCat.id) {
            const dx = cat.x - otherCat.x
            const dy = cat.y - otherCat.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            
            if (distance < 80) { // Collision radius
              const angle = Math.atan2(dy, dx)
              const pushForce = (80 - distance) * 0.1
              
              if (!cat.isDragging) {
                cat.velocityX += Math.cos(angle) * pushForce
                cat.velocityY += Math.sin(angle) * pushForce
              }
              if (!otherCat.isDragging) {
                otherCat.velocityX -= Math.cos(angle) * pushForce
                otherCat.velocityY -= Math.sin(angle) * pushForce
              }
            }
          }
        })

        return {
          ...cat,
          shakeOffset,
          x: newX,
          y: newY,
          velocityX: cat.isDragging ? 0 : cat.velocityX,
          velocityY: cat.isDragging ? 0 : cat.velocityY,
          rotation: newRotation,
          bounceCount: newBounceCount
        }
      })
    })

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight - 72
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    // Start animation
    requestRef.current = requestAnimationFrame(animate)
    // Add new cats periodically
    // const interval = setInterval(() => {
    //   setCats(prev => prev.length < 15 ? [...prev, createCat()] : prev)
    // }, 800)

    return () => {
      // clearInterval(interval)
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [windowSize.width, windowSize.height])

  useEffect(() => {
    if (cats.length < catCount) {
      setCats(prev => [...prev, createCat()]);
    }
  }, [catCount]);

  const handleMouseDown = (e: React.MouseEvent, catId: number) => {
    setDraggedCat(catId)
    setCats(prev => prev.map(cat => 
      cat.id === catId ? { ...cat, isDragging: true } : cat
    ))
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedCat === null) return
    setCats(prev => prev.map(cat => 
      cat.id === draggedCat ? {
        ...cat,
        x: e.clientX - 40,
        y: e.clientY - 40,
        velocityX: 0,
        velocityY: 0
      } : cat
    ))
  }

  const handleMouseUp = () => {
    if (draggedCat === null) return
    setCats(prev => prev.map(cat => 
      cat.id === draggedCat ? { ...cat, isDragging: false } : cat
    ))
    setDraggedCat(null)
  }

  return (
    <div 
      className="fixed inset-0 z-20 overflow-hidden pt-[72px]"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {cats.map(cat => (
        <div
          key={cat.id}
          className="absolute will-change-transform cursor-grab active:cursor-grabbing"
          style={{
            transform: `translate(${cat.x + cat.shakeOffset.x}px, ${cat.y + cat.shakeOffset.y}px) 
                       rotate(${cat.rotation}deg) scale(${cat.scale})`,
            transition: cat.isDragging ? 'none' : 'transform 16ms linear',
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
  )
}


'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import BouncingCats from '@/components/BouncingCats'
import { Eczar } from 'next/font/google'

const eczar = Eczar({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export default function AboutPage() {
  const [catCount, setCatCount] = useState(0);

  const handleAddCat = () => {
    setCatCount(prevCount => prevCount + 1);
  };

  return (
    <div className="min-h-screen bg-[#FFFBE8] overflow-hidden">
      <Navbar />
      <BouncingCats catCount={catCount} />
      <main className="relative z-20 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] -mt-16">
        <div className="w-full max-w-2xl bg-transparent rounded-[25px] p-8 shadow-sm border border-black/50">
          <h1 className={`text-5xl text-center mb-6 text-[#2D2D2D] font-semibold ${eczar.className}`}>
            polypal
          </h1>
          <p className="text-lg leading-relaxed text-[#2D2D2D]">
            Welcome to Polypal! 😼✨ Your coolest language-learning cat buddy where chatting with an AI cat makes picking up new languages fun and engaging.
            <br /><br />
            <strong>Interactive Learning:</strong> Practice real conversations with an AI that adapts to your language level and keeps things fresh.
            <br /><br />
            <strong>Multilingual Mastery:</strong> From Spanish to Japanese, explore a variety of languages while being gently corrected and guided.
            <br /><br />
            <strong>Cat Personality:</strong> Enjoy witty, pesky humor that makes every chat a delight.
            <br /><br />
            So grab your pillow and dive in—because learning is always purr-fect with a cat by your side! 🧊❄️
          </p>
          <button
            onClick={handleAddCat}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-bold mx-auto block"
          >
            Press to See Magic
          </button>
        </div>
      </main>
    </div>
  )
}


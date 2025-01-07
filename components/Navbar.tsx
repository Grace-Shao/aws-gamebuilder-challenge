"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const [isPlayOpen, setIsPlayOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Store', path: '/shopPage' },
  ]

  const playItems = [
    { name: 'Languages', path: '/languages' },
    { name: 'Levels', path: '/levels' },
    { name: 'Lessons', path: '/lessonPage' },
  ]

  return (
    <nav className="p-4 flex justify-between items-center bg-[#FFFBE8] font-work-sans">
      <div className="flex gap-4">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`px-4 py-2 font-bold hover:scale-110 transition-transform ${
              pathname === item.path
                ? "bg-[#FF9000] text-white rounded-full"
                : "text-black"
            }`}
          >
            {item.name}
          </Link>
        ))}
        <div className="relative">
          <button
            onClick={() => setIsPlayOpen(!isPlayOpen)}
            className={`px-4 py-2 font-bold hover:scale-110 transition-transform flex items-center ${
              playItems.some(item => pathname === item.path)
                ? "bg-[#FF9000] text-white rounded-full"
                : "text-black"
            }`}
          >
            Play
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>
          {isPlayOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              {playItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsPlayOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-gray-600"
        >
          <path
            fillRule="evenodd"
            d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  )
}


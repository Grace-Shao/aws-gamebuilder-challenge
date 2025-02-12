'use client'
import Navbar from "@/components/Navbar"
import { useRouter } from 'next/navigation'
import { Eczar, Work_Sans } from 'next/font/google'

const eczar = Eczar({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})


export default function LanguagesPage() {
  const router = useRouter()
  const languages = [
    "English",
    "Spanish",
    "Chinese",
    "German",
    "French",
    "Hindi",
    "Arabic",
  ]

  
  const handleLanguageSelect = (language: string) => {
    router.push(`/lessonPage?language=${language.toLowerCase()}`)
  }

  return (
    <div className="min-h-screen bg-[#FFFBE8]">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md bg-transparent rounded-[25px] p-8 shadow-sm border border-black/50">
          <h2 className={`text-2xl text-center mb-6 text-[#2D2D2D] font-semibold ${eczar.className}`}>Select Language</h2>
          <div className="space-y-3">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => handleLanguageSelect(language)}
                className={`w-full px-6 py-3 bg-[#FF9000] text-black border border-black rounded-[30px] font-medium text-lg hover:bg-[#FF9000]/90 transition-colors ${workSans.className}`}
              >
                {language}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}


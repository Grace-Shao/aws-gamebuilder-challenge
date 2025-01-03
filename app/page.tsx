import Link from "next/link"
import Image from "next/image"
import Navbar from "@/components/Navbar"

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-[#FFFBE8]">
      <Navbar />
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] -mt-16">
        <h1 className="font-eczar text-5xl mb-8 text-[#2D2D2D] font-bold">
          polypal
        </h1>
        
        <div className="w-32 h-32 relative mb-8">
          <Image
            src="/placeholder.svg"
            alt="PolyPal Mascot"
            width={128}
            height={128}
            className="rounded-full bg-[#FF9000]"
          />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <Link 
            href="/lessonPage"
            className="px-8 py-3 bg-[#FF9000] text-white rounded-full font-bold text-lg hover:bg-[#FF9000]/90 transition-colors"
          >
            start playing for free!
          </Link>
          
          <Link 
            href="/login"
            className="text-[#FF9000] hover:underline"
          >
            I already have an account
          </Link>
        </div>
      </main>
    </div>
  )
}
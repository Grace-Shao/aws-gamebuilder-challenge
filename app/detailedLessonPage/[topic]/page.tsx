'use client'

import { useEffect, useState, useRef } from 'react'
import Navbar from "@/components/Navbar"
import { useParams, useSearchParams } from 'next/navigation'
import Notes from "@/components/Notes"
import { ChatInterface } from '@/components/chat/ChatInterface'
import { Eczar } from 'next/font/google'

const eczar = Eczar({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

// const workSans = Work_Sans({
//   subsets: ['latin'],
//   weight: ['400', '500', '600', '700'],
//   display: 'swap',
// })

export default function DetailedLessonPage() {
    const params = useParams()
    const searchParams = useSearchParams()
    const topicParam = params?.topic as string
    const [topic, setTopic] = useState("")
    const language = (searchParams.get('language') || 'english').charAt(0).toUpperCase() + 
                    (searchParams.get('language') || 'english').slice(1)
    const [user, setUser] = useState<string | "">("");
    const level = "beginner" //i dont think we need this so if we have time we can refactor
    const [isPurring, setIsPurring] = useState(false)
    const audioRef = useRef<HTMLAudioElement | null>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const response = await fetch(`/api/get-session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setUser(data.userId);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        // Parse the topic from the URL parameter
        const parsedTopic = topicParam
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .trim() // Remove leading/trailing spaces
            .toLowerCase() // Convert to lowercase
            .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize first letter of each word
        setTopic(parsedTopic)
    }, [topicParam])

    useEffect(() => {
        // Initialize audio
        audioRef.current = new Audio('/catPurr.wav')
        audioRef.current.loop = true
        audioRef.current.volume = 0.3

        // Cleanup
        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    const togglePurring = () => {
        if (!audioRef.current) return

        if (isPurring) {
            audioRef.current.pause()
        } else {
            audioRef.current.play()
        }
        setIsPurring(!isPurring)
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#FFFBE8]">
            <Navbar />
            <div className="flex-grow flex justify-center px-4 py-6">
                <div className="w-full max-w-4xl">
                    <h1 className={`text-3xl font-bold text-[#2D2D2D] mb-6 text-center ${eczar.className}`}>
                        {topic}
                    </h1>
                    <div className="flex items-center justify-center mb-4 gap-2">
                        <button
                            onClick={togglePurring}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                isPurring 
                                    ? 'bg-[#FF9000]' 
                                    : 'bg-white border border-[#FF9000]'
                            }`}
                            title="Toggle Cat Purring"
                        >
                            <span className={isPurring ? 'text-white' : 'text-[#FF9000]'}>
                                🐱
                            </span>
                        </button>
                        <p className="text-sm text-gray-600">
                            <strong>Listen to Cat Purring while Studying </strong>
                        </p>
                    </div>
                    <ChatInterface topic={topic} language={language} />
                </div>
            </div>

            <Notes 
                user={user}
                lvl={level}
                topic={topic}
                language={language}
            />
        </div>
    )
}


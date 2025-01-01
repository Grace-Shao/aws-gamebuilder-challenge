'use client'

import { useEffect, useState } from 'react'
import Navbar from "@/components/Navbar"
import { useParams } from 'next/navigation'
import Notes from "@/components/Notes"
import { ChatInterface } from '@/components/chat/ChatInterface'

export default function DetailedLessonPage() {
    const params = useParams()
    const topicParam = params?.topic as string
    const [topic, setTopic] = useState("")
    //this is just a placeholder value
    const user = "user6"
    const level = "beginner"
    

    useEffect(() => {
        // Parse the topic from the URL parameter
        const parsedTopic = topicParam
            .replace(/([A-Z])/g, ' $1') // Add space before capital letters
            .trim() // Remove leading/trailing spaces
            .toLowerCase() // Convert to lowercase
            .replace(/\b\w/g, c => c.toUpperCase()) // Capitalize first letter of each word
        setTopic(parsedTopic)
    }, [topicParam])

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-pink-100 to-pink-200">
            <Navbar />
            <div className="flex-grow flex justify-center px-4 py-6">
                <div className="w-full max-w-4xl">
                    <h1 className="text-3xl font-bold text-pink-800 mb-6 text-center">
                        {topic}
                    </h1>
                    <ChatInterface topic={topic} />
                </div>
            </div>

            <Notes 
            user={user}
            lvl={level}
            topic={topic}
            />

        </div>
    )
}


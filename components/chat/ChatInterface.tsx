'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import Image from 'next/image'

const voiceCharacters: { [key: string]: string } = {
    "English" : "Joanna",
    "Spanish" : "Mia",
    "Chinese" : "Zhiyu",
    "German" : "Vicki",
    "French" : "Lea",
    "Hindi" : "Aditi",
    "Arabic" : "Zeina"
}

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
}

interface ChatInterfaceProps {
    topic: string
}

export function ChatInterface({ topic }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userMessageCount, setUserMessageCount] = useState(0);
    const messagesPerReward = 10;

    useEffect(() => {
        setMessages([])
        const initialMessage: Message = {
            id: Date.now().toString(),
            content: `Welcome! Let's discuss ${topic} in Chinese. I'll focus exclusively on this topic. What would you like to know about ${topic}?`,
            role: 'assistant',
        }
        setMessages([initialMessage])
    }, [topic])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage: Message = {
            id: Date.now().toString(),
            content: input,
            role: 'user',
        }

        setMessages((prev) => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    inputText: input,
                    topic: topic,
                    systemMessage: `You are a tutor focusing exclusively on the topic of "${topic}". 
                    Only provide information and responses related to this specific topic in the context of topic. 
                    If the user asks about anything outside this topic, politely redirect them back to ${topic}.`,
                }),
            })

            const data = await response.json()

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: data.message || "I apologize, but I couldn't process your request. Let's continue our discussion about " + topic + ".",
                role: 'assistant',
            }

            setUserMessageCount(userMessageCount + 1);

            setMessages((prev) => [...prev, assistantMessage])
        } catch (error) {
            console.error('Error:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: `I'm sorry, there was an error processing your request. Let's continue our discussion about ${topic}.`,
                role: 'assistant',
            }
            setMessages((prev) => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }

        try {
            if ((userMessageCount % messagesPerReward) == 0) {
                // const response = await fetch('/api/db/userProgress/points', {
                //     method: 'PATCH',
                //     body: JSON.stringify({ userId: 1, quantity: 10 }),
                // });
            }
        }
        catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "I'm sorry, there was an error updating points.",
                role: 'assistant',
            };
            setMessages((prev) => [...prev, errorMessage]);
        }
    }

    //text to speech starts
    let language = "Chinese" //change this
    const [isLoadingVoice, setIsLoadingVoice] = useState(false);
    const playWithVoice = async ( message: String ) => {
        if (!message) {
            return;
        }
        let voiceId = voiceCharacters[language]
        setIsLoadingVoice(true);

        try {
            const response = await fetch('/api/polly', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    text: message,
                    voiceId: voiceId
                }),
            });
            if (!response.ok) {
                throw new Error('Speech synthesis failed');
            }

            const audioBlob = await response.blob();
            const audio = new Audio(URL.createObjectURL(audioBlob));

            audio.onended = () => {
                URL.revokeObjectURL(audio.src);
                setIsLoadingVoice(false);
            };
            await audio.play();

        } catch (error) {
            console.error('Error:', error);
            setIsLoadingVoice(false);
        }
    };
    //text to speech ends here

    return (
        <Card className="flex flex-col h-[calc(100vh-140px)] bg-white/80 backdrop-blur-sm border-[#594F43]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div key={message.id} className="flex items-start gap-2">
                        <MessageBubble content={message.content} role={message.role} />
                        {message.role === 'assistant' && (
                            <button
                                onClick={() =>playWithVoice(message.content)}
                                disabled={isLoadingVoice}
                                //move it using this
                                className="flex-shrink-0 -ml-1 mt-2"  
                            >
                                <Image 
                                    src="/voice.png" 
                                    alt="error" 
                                    // change the size here
                                    width={40}  
                                    height={40}
                                />
                            </button>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-center space-x-2">
                        <div className="animate-pulse h-2 w-2 rounded-full bg-[#FF9000]" />
                        <div className="animate-pulse h-2 w-2 rounded-full bg-[#FF9000] animation-delay-200" />
                        <div className="animate-pulse h-2 w-2 rounded-full bg-[#FF9000] animation-delay-400" />
                    </div>
                )}
            </div>
            <MessageInput
                input={input}
                isLoading={isLoading}
                onSubmit={handleSubmit}
                onInputChange={(e) => setInput(e.target.value)}
            />
        </Card>
    )
}
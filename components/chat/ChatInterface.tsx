'use client'

import { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { MessageBubble } from './message-bubble'
import { MessageInput } from './message-input'
import Image from 'next/image'
import catSleepAnimation from "@/public/catSleep.json"
import dynamic from 'next/dynamic'
// Dynamically import lottie-react to avoid document is not defined
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const voiceCharacters: { [key: string]: string } = {
    "English" : "Joanna",
    "Spanish" : "Mia",
    "Chinese" : "Zhiyu",
    "German" : "Vicki",
    "French" : "Lea",
    "Hindi" : "Aditi",
    "Arabic" : "Zeina"
}

const welcomeMessages: { [key: string]: string } = {
    "English": "Welcome! Let's discuss",
    "Spanish": "¡Bienvenido! Hablemos de",
    "Chinese": "欢迎！让我们讨论",
    "German": "Willkommen! Lass uns über",
    "French": "Bienvenue ! Parlons de",
    "Hindi": "स्वागत है! चलिए चर्चा करते हैं",
    "Arabic": "!مرحباً! دعنا نتحدث عن"
};

interface Message {
    id: string
    content: string
    role: 'user' | 'assistant'
}

interface ChatInterfaceProps {
    topic: string;
    language: string;
}

const splitMessage = (message: string, maxLength: number = 150): string[] => {
    // First, check if the message contains a numbered list
    const hasNumberedList = message.match(/\d+\./);
    
    if (hasNumberedList) {
        // Split by numbered items (looking for patterns like "1.", "2.", etc.)
        const parts = message.split(/(?=\d+\.)/);
        const bubbles: string[] = [];
        
        let currentBubble = '';
        parts.forEach(part => {
            // If this isn't a list item, process it normally
            if (!part.match(/^\d+\./)) {
                const sentences = part.match(/[^.!?]+[.!?]+\s*/g) || [part];
                sentences.forEach(sentence => {
                    if ((currentBubble + sentence).length > maxLength) {
                        if (currentBubble) bubbles.push(currentBubble.trim());
                        currentBubble = sentence;
                    } else {
                        currentBubble += sentence;
                    }
                });
            } else {
                // For list items, keep them together
                if (currentBubble && !currentBubble.match(/\d+\./)) {
                    bubbles.push(currentBubble.trim());
                    currentBubble = '';
                }
                // Group 2-3 list items together if they're short enough
                if ((currentBubble + part).length > maxLength * 1.5) {
                    if (currentBubble) {
                        bubbles.push(currentBubble.trim())
                    }
                    currentBubble = part;
                } else {
                    currentBubble += part;
                }
            }
        });
        
        if (currentBubble) bubbles.push(currentBubble.trim());
        return bubbles;
    }
    
    // If no numbered list, use the original sentence-based splitting
    const sentences = message.match(/[^.!?]+[.!?]+\s*/g) || [message];
    const bubbles: string[] = [];
    
    let currentBubble = '';
    
    sentences.forEach(sentence => {
        // If current sentence is already too long, split by commas
        if (sentence.length > maxLength) {
            const parts = sentence.split(/,\s*/);
            parts.forEach(part => {
                if ((currentBubble + part).length > maxLength) {
                    if (currentBubble) bubbles.push(currentBubble.trim());
                    currentBubble = part;
                } else {
                    currentBubble += (currentBubble ? ', ' : '') + part;
                }
            });
        } else if ((currentBubble + sentence).length > maxLength) {
            bubbles.push(currentBubble.trim());
            currentBubble = sentence;
        } else {
            currentBubble += sentence;
        }
    });
    
    if (currentBubble) bubbles.push(currentBubble.trim());
    return bubbles;
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ topic, language }) => {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userMessageCount] = useState(0);
    const messagesPerReward = 10;
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        setMessages([])
        const greeting = welcomeMessages[language] || welcomeMessages["English"];
        const initialMessage: Message = {
            id: Date.now().toString(),
            content: `${greeting} ${topic} in ${language}. I'm Mistah Purry and I'm here to help you focus exclusively on this topic. What would you like to know about ${topic}?`,
            role: 'assistant',
        }
        setMessages([initialMessage])
    }, [topic, language])

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
                    language: language,
                    systemMessage: 
                    `
                    You are a playful and funny cat teaching ${topic} in ${language}. 
                    Your role is to:
                    1. Teach the words or phrases strictly in ${language}. Use playful, cat-like expressions, such as "This word is paw-some!" or "Meow-mazing, isn't it?"
                    2. Explain the meaning and context of the words or phrases in English. Your explanations should be simple, clear, and engaging, with a touch of humor.
                    3. Stay focused on ${topic} and ${language}. If the user asks about anything else, redirect them back with cat puns like, "Oops, that's outside my litter box of knowledge. Let's stick to ${topic}, meow!"
                    4. Keep your tone playful, curious, and cat-like. Use phrases like "purr-fect," "meow," and "paw-some" in your responses.
                    5. Always make learning fun, like a cat showing off its new toy.
                    6. Explain the concepts as if learners are very beginners, 5 years old, and keep it short, simple, stupid

                    Remember, you're a funny, language-loving cat sharing your paw-some knowledge with humans!
                    `,
                }),
            })

            const data = await response.json()
            const messageBubbles = splitMessage(data.message);
            
            // Add each bubble as a separate message
            messageBubbles.forEach((bubble, index) => {
                const assistantMessage: Message = {
                    id: (Date.now() + index).toString(),
                    content: bubble,
                    role: 'assistant',
                };
                setMessages(prev => [...prev, assistantMessage]);
            });
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
        const [isLoadingVoice, setIsLoadingVoice] = useState(false);
        const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

        const playWithVoice = async ( message: string ) => {
            if (!message) {
                return;
            }
            
            if (isLoadingVoice === false) {
                if (currentAudio) {
                    //reset the audio back to the beginning
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }
                setCurrentAudio(null);
                return;
            }

            const voiceId = voiceCharacters[language]
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
                    setCurrentAudio(null);
                };
                setCurrentAudio(audio);
                await audio.play();
    
            } catch (error) {
                console.error('Error:', error);
                setCurrentAudio(null);
            }
        };
        //text to speech ends here

    const toggleVoice = () => {
        setIsSpeaking(!isSpeaking);
        if (isSpeaking) {
            // Stop speaking logic here if needed
        } else {
            // Start speaking logic here if needed
        }
    };

    return (
        <div className="relative">
            {/* Cat animation container */}
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 z-10">
                <Lottie 
                    animationData={catSleepAnimation}
                    loop={true}
                    className="w-full h-full"
                />
            </div>

            <Card className="flex flex-col h-[calc(100vh-140px)] bg-white/80 backdrop-blur-sm border-[#594F43]">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div key={message.id} className="flex items-start gap-1 w-full">
                            <MessageBubble content={message.content} role={message.role} />
                            {message.role === 'assistant' && (
                                <button
                                    onClick={toggleVoice}
                                    className="flex-shrink-0 -ml-0.5 mt-1"
                                >
                                    <Image 
                                        src={isSpeaking ? "/catMouthOn.png" : "/catMouthOff.png"}
                                        alt="Voice Toggle" 
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
        </div>
    )
}

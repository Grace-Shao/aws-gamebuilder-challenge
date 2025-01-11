/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import catHangingAnimation from "@/public/catHanging.json"
import catSpinAnimation from "@/public/catSpin.json"
import dynamic from 'next/dynamic'
// Dynamically import lottie-react to avoid document is not defined
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

interface NotesProps {
    user: string;
    lvl: string;
    topic: string;
    language: string;
}

export default function Notes({ user, lvl, topic, language }: NotesProps) {
    const [isNotesOpen, setIsNotesOpen] = useState(false)
    const [noteContent, setNoteContent] = useState('')
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    
    // Update the db 
    const saveNoteToDynamoDB = async () => {
        if (!user) {
            return;
        }
        const currentDate = new Date()
        const response = await fetch(`/api/db/notesLevels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "update",
                user: user,
                topic: topic,
                noteContent: noteContent,
                lvl: lvl,
                currentDate: currentDate.toISOString(),
                lang: language
            }),
        })
        setLastSaved(currentDate.toLocaleString())
        return response
    }

    // Gets the stuff from the db to show on the notes page
    const fetchNotes = async () => {
        if (!user) {
            return;
        }
        setIsLoading(true)
        const response = await fetch(`/api/db/notesLevels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: "fetch",
                user: user,
                topic: topic,
                lang: language
            }),
        })
        const data = await response.json()
        if (data.Item) {
            // Get the note content if available otherwise the notes is just empty
            setNoteContent(data.Item.noteContent || '')
            if (data.Item.updatedAt) {
                setLastSaved(new Date(data.Item.updatedAt).toLocaleString())
            }
        }
        setIsLoading(false)
        return response
    }

    useEffect(() => {
        if (isNotesOpen) {
            fetchNotes()
        }
    }, [isNotesOpen])

    if (isNotesOpen) {
        return (
            <div className="relative">
                <Card className="fixed right-0 top-[65px] w-[400px] h-[calc(100vh-140px)] flex flex-col shadow-lg z-50 bg-white/95 backdrop-blur-sm rounded-[15px]">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Save Your Notes Here!</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsNotesOpen(false)}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                    
                    {/* Hanging cat animation */}
                    <div className="absolute -right-1 top-[58px] w-20 h-20">
                        <Lottie 
                            animationData={catHangingAnimation}
                            loop={true}
                            className="w-full h-full"
                        />
                    </div>
                    { (typeof user === "string" && user.trim() !== "") ? (
                        isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="w-24 h-24">
                                    <Lottie 
                                        animationData={catSpinAnimation}
                                        loop={true}
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                        ) : (
                            <textarea
                                value={noteContent}
                                onChange={(e) => setNoteContent(e.target.value)}
                                className="flex-1 w-full p-4 bg-transparent border-0 resize-none focus:outline-none h-[calc(100%-110px)]"
                                placeholder="Write your notes here..."
                            />
                        )) : (
                            <textarea
                            value="Notes are available upon sign up!"
                            readOnly
                            className="flex-1 w-full p-4 bg-transparent border-0 resize-none focus:outline-none h-[calc(100%-110px)] text-center"
                        />
                    )}

                    <div className="p-4 border-t flex items-center justify-between">
                        <Button 
                        onClick={saveNoteToDynamoDB}
                        disabled={!user}
                        >
                            Save Note
                        </Button>
                        {lastSaved && (
                            <span className="text-sm text-gray-500">
                                Saved on {lastSaved}
                            </span>
                        )} 
                    </div> 
                </Card>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <Button
                variant="ghost"
                onClick={() => setIsNotesOpen(true)}
                className={`fixed right-6 top-[75px] z-50 w-10 h-10 rounded-full flex items-center justify-center border border-[#FF9000] hover:bg-[#FF9000] transition-colors p-0`}
            >
                <Image 
                    src="/notes.png"
                    alt="Notes Icon"
                    width={24}
                    height={24}
                    className="transition-colors"
                />
            </Button>
            <span className="text-sm text-gray-600 mt-1 font-bold">Click on words or phrases to see their pronounciation</span>
        </div>
    )
}


'use client'

import { useState, useEffect} from 'react'
import Image from 'next/image'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { UpdateCommand, GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb"
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

// connect to client by input the access key id and secret access key id using a file
const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID_dynamo,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_dynamo
    }
});

const docClient = DynamoDBDocumentClient.from(client)

interface NotesProps {
    user: string;
    lvl: string;
    topic: string;
  }

export default function Notes({ user, lvl, topic }: NotesProps) {
    const [isNotesOpen, setIsNotesOpen] = useState(false)
    const [noteContent, setNoteContent] = useState('')
    const [lastSaved, setLastSaved] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    //update the db 
    const saveNoteToDynamoDB = async () => {
        const currentDate = new Date()
        const command = new UpdateCommand({
            TableName: "TestingUsers2.0",
            Key: {
                userId: user,
                topic: topic
            },
            UpdateExpression: "SET noteContent = :noteContent, lvl = :lvl, updatedAt = :updatedAt",
            ExpressionAttributeValues: {
                ":noteContent": noteContent,
                ":lvl": lvl,
                ":updatedAt": currentDate.toISOString()
            },
            ReturnValues: "ALL_NEW"
        });

        const response = await docClient.send(command)
        setLastSaved(currentDate.toLocaleString())
        return response
    }

    //gets the stuff from the db to show on the notes page
    const fetchNotes = async () => {
        setIsLoading(true)
        const command = new GetCommand({
            TableName: "TestingUsers2.0",
            Key: {
                userId: user,
                topic: topic
            }
        })

        const response = await docClient.send(command)
        if (response.Item) {
            //get the note content if available otherwise the notes is just empty
            setNoteContent(response.Item.noteContent || '')
            if (response.Item.updatedAt) {
                setLastSaved(new Date(response.Item.updatedAt).toLocaleString())
            }
        }
        setIsLoading(false)
    }


    useEffect(() => {
        if (isNotesOpen) {
            fetchNotes()
        }
    }, [isNotesOpen])

    if (isNotesOpen) {
        return (
            <Card className="fixed right-0 top-[65px] w-[400px] h-[calc(100vh-65px)] flex flex-col shadow-lg z-50 bg-white/95 backdrop-blur-sm">
                <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Notes</h2>
                <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsNotesOpen(false)}
                className="h-8 w-8"
                >
                <X className="h-4 w-4" />
                </Button>
                </div>
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        Loading notes...
                    </div>
                ) : (
                    <textarea
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        className="flex-1 w-full p-4 bg-transparent border-0 resize-none focus:outline-none"
                        placeholder="Write your notes here..."
                    />
                )}

                <div className="p-4 border-t flex items-center justify-between">
                    <Button onClick={saveNoteToDynamoDB}>
                        Save Note
                    </Button>
                    {lastSaved && (
                        <span className="text-sm text-gray-500">
                            Saved on {lastSaved}
                        </span>
                    )}
                </div>
            </Card>
        )
    }

    return (
        <Button
            variant="ghost"
            className="fixed right-6 top-[75px] z-50"
            onClick={() => setIsNotesOpen(true)}
        >
            <Image 
                src="/notes.png"
                alt="Notes Icon"
                width={32}
                height={32}
                className="opacity-80 hover:opacity-100 transition-opacity"
            />
        </Button>
    )
}


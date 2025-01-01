'use client'

import { useState } from 'react';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, MessageCircle, BookText, Globe, Plane, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LessonPage() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);

    const topics = [
        { title: "Beginner Topics", items: [
            { name: "Foods", description: "Learn about Chinese cuisine", icon: BookOpen, href: "/detailedLessonPage/BeginnerFoods" },
            { name: "Conversations", description: "Practice basic dialogues", icon: MessageCircle, href: "/detailedLessonPage/BeginnerConversations" },
            { name: "Grammar", description: "Master fundamental rules", icon: BookText, href: "/detailedLessonPage/BeginnerGrammar" },
        ]},
        { title: "Intermediate Topics", items: [
            { name: "Culture", description: "Explore Chinese traditions", icon: Globe, href: "/detailedLessonPage/IntermediateCulture" },
            { name: "Travel", description: "Learn travel-related vocabulary", icon: Plane, href: "/detailedLessonPage/IntermediateTravel" },
            { name: "Health", description: "Discuss health and wellness", icon: Heart, href: "/detailedLessonPage/IntermediateHealth" },
        ]},
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200">
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-12"
            >
                <h1 className="text-4xl font-bold text-pink-800 mb-12 text-center">
                    Chinese Language Lessons
                </h1>
                {topics.map((topic, topicIndex) => (
                    <motion.div 
                        key={topicIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: topicIndex * 0.2 }}
                        className="mb-16"
                    >
                        <h2 className="text-3xl font-semibold text-pink-700 mb-6">{topic.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {topic.items.map((item, itemIndex) => (
                                <Link key={itemIndex} href={item.href}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        onHoverStart={() => setHoveredCard(topicIndex * 3 + itemIndex)}
                                        onHoverEnd={() => setHoveredCard(null)}
                                    >
                                        <Card className="h-full overflow-hidden bg-white bg-opacity-80 backdrop-blur-lg border-2 border-pink-200 hover:border-pink-400 transition-all duration-300">
                                            <CardHeader className="flex flex-col items-center text-center p-6">
                                                <motion.div 
                                                    className="bg-pink-200 p-4 rounded-full mb-4"
                                                    animate={{ 
                                                        scale: hoveredCard === topicIndex * 3 + itemIndex ? 1.1 : 1,
                                                        rotate: hoveredCard === topicIndex * 3 + itemIndex ? 360 : 0 
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <item.icon className="w-10 h-10 text-pink-600" />
                                                </motion.div>
                                                <CardTitle className="text-2xl font-bold text-pink-700 mb-2">{item.name}</CardTitle>
                                                <CardDescription className="text-pink-600 text-lg">{item.description}</CardDescription>
                                            </CardHeader>
                                        </Card>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}


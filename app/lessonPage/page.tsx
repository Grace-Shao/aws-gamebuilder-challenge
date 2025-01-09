'use client'

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageCircle, Globe, Heart, Clock, ShoppingCart, Smile, Users, Palette, Sun, Brain, Map, Utensils, Newspaper, Lightbulb, Zap, Briefcase, Feather, Music} from 'lucide-react';
import { motion } from 'framer-motion';
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

export default function LessonPage() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const searchParams = useSearchParams();
    const language = searchParams.get('language') || 'english';

    const topics = [
        { 
            title: "Beginner Topics 😺", 
            items: [
                { name: "Greetings & Self-Introduction", description: "Learn basic introductions", icon: MessageCircle, href: "/detailedLessonPage/BeginnerGreetings" },
                { name: "Numbers, Time, and Dates", description: "Master essential time concepts", icon: Clock, href: "/detailedLessonPage/BeginnerNumbers" },
                { name: "Daily Activities", description: "Discuss everyday routines", icon: Sun, href: "/detailedLessonPage/BeginnerActivities" },
                { name: "Shopping & Ordering Food", description: "Practice buying and ordering", icon: ShoppingCart, href: "/detailedLessonPage/BeginnerShopping" },
                { name: "Basic Polite Expressions", description: "Learn essential courtesies", icon: Smile, href: "/detailedLessonPage/BeginnerPolite" },
                { name: "Colors, Weather, and Nature", description: "Describe the world around you", icon: Palette, href: "/detailedLessonPage/BeginnerNature" },
                { name: "Family & Friends", description: "Talk about relationships", icon: Users, href: "/detailedLessonPage/BeginnerFamily" },
                { name: "Emotions & Feelings", description: "Express basic emotions", icon: Heart, href: "/detailedLessonPage/BeginnerEmotions" },
            ]
        },
        { 
            title: "Intermediate Topics 😼", 
            items: [
                { name: "Travel & Directions", description: "Navigate new places", icon: Map, href: "/detailedLessonPage/IntermediateTravel" },
                { name: "Describing People & Places", description: "Use detailed descriptions", icon: Globe, href: "/detailedLessonPage/IntermediateDescriptions" },
                { name: "Making Plans & Socializing", description: "Arrange outings with friends", icon: Users, href: "/detailedLessonPage/IntermediateSocializing" },
                { name: "At a Hotel or Restaurant", description: "Handle common travel situations", icon: Utensils, href: "/detailedLessonPage/IntermediateHotelRestaurant" },
                { name: "Health & Wellbeing", description: "Discuss health and fitness", icon: Heart, href: "/detailedLessonPage/IntermediateHealth" },
                { name: "Jobs & Work-Life", description: "Talk about careers", icon: Briefcase, href: "/detailedLessonPage/IntermediateJobs" },
                { name: "Entertainment & Media", description: "Discuss movies, books, and music", icon: Music, href: "/detailedLessonPage/IntermediateEntertainment" },
                { name: "Food & Cooking", description: "Explore culinary topics", icon: Utensils, href: "/detailedLessonPage/IntermediateCooking" },
            ]
        },
        { 
            title: "Advanced Topics 🙀", 
            items: [
                { name: "Discussing Opinions & Current Events", description: "Engage in complex debates", icon: Newspaper, href: "/detailedLessonPage/AdvancedCurrentEvents" },
                { name: "Complex Conversations & Abstract Topics", description: "Explore philosophical ideas", icon: Brain, href: "/detailedLessonPage/AdvancedAbstractTopics" },
                { name: "Problem-Solving & Role Play", description: "Handle challenging scenarios", icon: Zap, href: "/detailedLessonPage/AdvancedProblemSolving" },
                { name: "Storytelling & Narration", description: "Craft engaging narratives", icon: Feather, href: "/detailedLessonPage/AdvancedStorytelling" },
                { name: "Technology & Science", description: "Discuss cutting-edge innovations", icon: Lightbulb, href: "/detailedLessonPage/AdvancedTechnology" },
                { name: "Hypothetical Scenarios", description: "Explore 'what if' situations", icon: Brain, href: "/detailedLessonPage/AdvancedHypotheticals" },
                { name: "Cultural Exchange & Traditions", description: "Compare global customs", icon: Globe, href: "/detailedLessonPage/AdvancedCulture" },
                { name: "Business & Professional Communication", description: "Master workplace language", icon: Briefcase, href: "/detailedLessonPage/AdvancedBusiness" },
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-[#FFFBE8]">
            <Navbar />
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-4 py-12"
            >
                <h1 className={`text-4xl font-bold text-[#FF9000] mb-12 text-center ${eczar.className}`}>
                    {language.charAt(0).toUpperCase() + language.slice(1)} Language Lessons
                </h1>
                {topics.map((topic, topicIndex) => (
                    <motion.div 
                        key={topicIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: topicIndex * 0.2 }}
                        className="mb-16"
                    >
                        <h2 className={`text-3xl font-semibold text-[#FF9000] mb-6 ${workSans.className}`}>{topic.title}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {topic.items.map((item, itemIndex) => (
                                <Link key={itemIndex} href={`${item.href}?language=${language}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        onHoverStart={() => setHoveredCard(topicIndex * 8 + itemIndex)}
                                        onHoverEnd={() => setHoveredCard(null)}
                                    >
                                        <Card className="h-[220px] overflow-hidden bg-white bg-opacity-80 backdrop-blur-lg border-2 border-[#FFE0B2] hover:border-[#FF9000] transition-all duration-300">
                                            <CardHeader className="flex flex-col items-center justify-between text-center p-6 h-full">
                                                <motion.div 
                                                    className="bg-[#FFE0B2] p-4 rounded-full mb-4"
                                                    animate={{ 
                                                        scale: hoveredCard === topicIndex * 8 + itemIndex ? 1.1 : 1,
                                                        rotate: hoveredCard === topicIndex * 8 + itemIndex ? 360 : 0 
                                                    }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    <item.icon className="w-8 h-8 text-[#FF9000]" />
                                                </motion.div>
                                                <CardTitle className="text-xl font-bold text-[#FF9000] mb-2 line-clamp-2">{item.name}</CardTitle>
                                                <CardDescription className="text-[#000000] text-sm line-clamp-2">{item.description}</CardDescription>
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


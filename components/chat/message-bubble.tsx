import { cn } from "@/lib/utils";
import { User } from 'lucide-react';
import Image from 'next/image';
import MarkdownRenderer from "../MarkdownRender";

interface MessageBubbleProps {
  content: string;
  role: 'user' | 'assistant';
}

export function MessageBubble({ content, role }: MessageBubbleProps) {
  return (
    <div className={cn("flex", role === 'user' ? "justify-end" : "justify-start")}>
      {role === 'assistant' && (
        <div className={cn("flex space-x-1")}>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-[#FF9000]")}>
            <Image 
              src="/catAvatar2.png"
              alt="Assistant Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </div>
          <div className={cn("rounded-lg px-4 py-2 text-sm max-w-[80%]", "bg-[#FF9000] text-[#020202] border-[#594F43]")}>
            <MarkdownRenderer markdownText={content} />
          </div>
        </div>
      )}
      {role === 'user' && (
        <div className={cn("flex space-x-1")}>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center border-2 bg-[#8CDBF3]")}>
            <User className="w-5 h-5 text-pink-700" />
          </div>
          <div className={cn("rounded-lg px-4 py-2 text-sm max-w-[80%]", "bg-[#8CDBF3] text-[#020202] border-[#594F43]")}>
            <MarkdownRenderer markdownText={content} />
          </div>
        </div>
      )}
    </div>
  );
}

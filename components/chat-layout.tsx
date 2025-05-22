"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSupabase } from "./supabase-provider"
import ChatSidebar from "./chat-sidebar"
import ChatWindow from "./chat-window"
import { useToast } from "@/components/ui/use-toast"
import type { User, Conversation, Message } from "@/lib/types"

interface ChatLayoutProps {
  user: User
  initialConversations: Conversation[]
  activeConversationId?: string
  initialMessages?: Message[]
  conversationDetails?: any
}

export default function ChatLayout({
  user,
  initialConversations,
  activeConversationId,
  initialMessages = [],
  conversationDetails,
}: ChatLayoutProps) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [loading, setLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Subscribe to new messages
  useEffect(() => {
    if (!activeConversationId) return

    const channel = supabase
      .channel(`messages:${activeConversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${activeConversationId}`,
        },
        (payload) => {
          const newMessage = payload.new as Message
          setMessages((current) => [...current, newMessage])
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, activeConversationId])

  // Subscribe to conversation updates
  useEffect(() => {
    const channel = supabase
      .channel("conversations")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
        },
        () => {
          // Refresh conversations on any change
          fetchConversations()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchConversations = async () => {
    try {
      const { data, error } = await supabase
        .from("conversations")
        .select(`
          *,
          conversation_members!inner(user_id),
          last_message:messages(content, created_at, sender_id)
        `)
        .eq("conversation_members.user_id", user.id)
        .order("updated_at", { ascending: false })
        .limit(50)

      if (error) throw error

      const processedConversations = data.map((conversation) => {
        const lastMessage = conversation.last_message?.[0] || null
        return {
          ...conversation,
          last_message: lastMessage,
        }
      })

      setConversations(processedConversations)
    } catch (error: any) {
      toast({
        title: "Error fetching conversations",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const sendMessage = async (content: string) => {
    if (!activeConversationId || !content.trim()) return

    try {
      setLoading(true)

      // Check if we're in demo mode (no Supabase credentials)
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        // In demo mode, just add the message locally
        const newMessage: Message = {
          id: Math.random().toString(36).substring(2, 15),
          conversation_id: activeConversationId,
          sender_id: user.id,
          content: content.trim(),
          created_at: new Date().toISOString(),
        }

        setMessages((current) => [...current, newMessage])

        // Simulate a response after 1 second in demo mode
        setTimeout(() => {
          const responseMessage: Message = {
            id: Math.random().toString(36).substring(2, 15),
            conversation_id: activeConversationId,
            sender_id:
              activeConversationId === "conv-1"
                ? "john-id"
                : activeConversationId === "conv-2"
                  ? "sarah-id"
                  : "team-member-id",
            content: "Thanks for your message! This is a demo response.",
            created_at: new Date().toISOString(),
          }
          setMessages((current) => [...current, responseMessage])
        }, 1000)

        return
      }

      const { error } = await supabase.from("messages").insert({
        conversation_id: activeConversationId,
        sender_id: user.id,
        content: content.trim(),
      })

      if (error) throw error

      // Update conversation's updated_at timestamp
      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", activeConversationId)
    } catch (error: any) {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleConversationClick = (conversationId: string) => {
    router.push(`/chats/${conversationId}`)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onConversationClick={handleConversationClick}
        user={user}
      />

      {activeConversationId ? (
        <ChatWindow
          messages={messages}
          conversationDetails={conversationDetails}
          onSendMessage={sendMessage}
          currentUser={user}
          loading={loading}
          messagesEndRef={messagesEndRef}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900">Select a conversation</h3>
            <p className="mt-1 text-sm text-gray-500">Choose a conversation from the sidebar to start chatting</p>
          </div>
        </div>
      )}
    </div>
  )
}

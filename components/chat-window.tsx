"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { format } from "date-fns"
import { Paperclip, Send, Phone, Video, Info, Smile } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Message } from "@/lib/types"
import type { User } from "@/lib/user" // Renamed import to avoid redeclaration

interface ChatWindowProps {
  messages: Message[]
  conversationDetails: any
  onSendMessage: (content: string) => void
  currentUser: User
  loading: boolean
  messagesEndRef: React.RefObject<HTMLDivElement>
}

export default function ChatWindow({
  messages,
  conversationDetails,
  onSendMessage,
  currentUser,
  loading,
  messagesEndRef,
}: ChatWindowProps) {
  const [messageInput, setMessageInput] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Focus input when component mounts
    inputRef.current?.focus()
  }, [conversationDetails?.id])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() && !loading) {
      onSendMessage(messageInput)
      setMessageInput("")
    }
  }

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {}
  messages.forEach((message) => {
    const date = format(new Date(message.created_at), "MMMM d, yyyy")
    if (!groupedMessages[date]) {
      groupedMessages[date] = []
    }
    groupedMessages[date].push(message)
  })

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Chat Header */}
      <div className="border-b border-gray-200">
        <div className="flex items-center justify-between p-3">
          <div className="flex items-center">
            <Avatar className="h-10 w-10 mr-3">
              <AvatarImage src={conversationDetails?.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-white">
                {conversationDetails?.name?.charAt(0) || "C"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-sm font-medium text-gray-900">{conversationDetails?.name || "Conversation"}</h2>
              <p className="text-xs text-gray-500">Last active: {format(new Date(), "h:mm a")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Phone className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Video className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Info className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-gray-50">
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-hide">
        {Object.keys(groupedMessages).map((date) => (
          <div key={date}>
            <div className="chat-date-divider">
              <span className="chat-date-divider-text">{date}</span>
            </div>
            {groupedMessages[date].map((message, index) => (
              <div key={index} className="mb-4">
                <div className={`flex ${message.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}>
                  {message.sender_id !== currentUser.id && (
                    <Avatar className="h-8 w-8 mr-2 mt-1">
                      <AvatarFallback className="bg-secondary text-secondary-foreground">
                        {conversationDetails?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div>
                    <div
                      className={`chat-bubble ${
                        message.sender_id === currentUser.id ? "chat-bubble-sent" : "chat-bubble-received"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div
                      className={`text-xs text-gray-500 mt-1 ${
                        message.sender_id === currentUser.id ? "text-right" : "text-left"
                      }`}
                    >
                      {format(new Date(message.created_at), "h:mm a")}
                    </div>
                  </div>
                  {message.sender_id === currentUser.id && (
                    <Avatar className="h-8 w-8 ml-2 mt-1">
                      <AvatarImage src={currentUser.avatar_url || ""} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {currentUser.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-3 bg-white">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10">
            <Paperclip className="h-5 w-5 text-gray-500" />
          </Button>
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 mx-2 bg-gray-50"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={loading}
          />
          <Button type="button" variant="ghost" size="icon" className="h-10 w-10">
            <Smile className="h-5 w-5 text-gray-500" />
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="icon"
            className="h-10 w-10 bg-primary text-white rounded-full"
            disabled={!messageInput.trim() || loading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 border-l border-gray-200 bg-white hidden lg:block">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-medium text-gray-900">Conversation Info</h3>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Assigned to</h4>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {currentUser.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-900">{currentUser.name}</span>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Labels</h4>
            <div className="flex flex-wrap gap-1">
              <Badge variant="outline" className="text-xs">
                <Avatar className="h-3 w-3 mr-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">Support</AvatarFallback>
                </Avatar>
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Avatar className="h-3 w-3 mr-1">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">Priority</AvatarFallback>
                </Avatar>
              </Badge>
            </div>
          </div>

          <div className="mb-4">
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Members</h4>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarFallback className="bg-primary text-white text-xs">
                  {currentUser.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-900">{currentUser.name}</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Customer</h4>
            <div className="flex items-center">
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={conversationDetails?.avatar_url || ""} />
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {conversationDetails?.name?.charAt(0) || "C"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-gray-900">{conversationDetails?.name || "Customer"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

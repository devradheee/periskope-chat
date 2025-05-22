"use client"

import { useState } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Search, Settings, Bell, Filter, Plus, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useSupabase } from "./supabase-provider"
import { useRouter } from "next/navigation"
import type { User, Conversation } from "@/lib/types"

interface ChatSidebarProps {
  conversations: Conversation[]
  activeConversationId?: string
  onConversationClick: (id: string) => void
  user: User
}

export default function ChatSidebar({
  conversations,
  activeConversationId,
  onConversationClick,
  user,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  const filteredConversations = conversations.filter((conversation) =>
    conversation.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image
              src="/periskope-logo.png"
              alt="Periskope Logo"
              width={120}
              height={30}
              className="h-6 w-auto"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bell className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Settings className="h-5 w-5 text-gray-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations"
            className="pl-8 bg-gray-50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              All
            </Button>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Unread
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Plus className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                activeConversationId === conversation.id ? "bg-blue-50" : ""
              }`}
              onClick={() => onConversationClick(conversation.id)}
            >
              <div className="flex items-start">
                <Avatar className="h-10 w-10 mr-3 flex-shrink-0">
                  <AvatarImage src={conversation.avatar_url || ""} />
                  <AvatarFallback className="bg-primary text-white">
                    {conversation.name?.charAt(0) || "C"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.name || "Unnamed Chat"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {conversation.last_message?.created_at
                        ? format(new Date(conversation.last_message.created_at), "h:mm a")
                        : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-gray-500 truncate">
                      {conversation.last_message?.content || "No messages yet"}
                    </p>
                    {conversation.unread_count ? (
                      <Badge
                        variant="default"
                        className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                      >
                        {conversation.unread_count}
                      </Badge>
                    ) : null}
                  </div>
                  {conversation.labels && conversation.labels.length > 0 && (
                    <div className="flex mt-1 space-x-1">
                      {conversation.labels.map((label, index) => (
                        <Badge key={index} variant="outline" className="text-xs px-1 py-0 h-4">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">No conversations found</div>
        )}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-gray-200 flex items-center">
        <Avatar className="h-8 w-8 mr-2">
          <AvatarImage src={user.avatar_url || ""} />
          <AvatarFallback className="bg-primary text-white">{user.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">Online</p>
        </div>
      </div>
    </div>
  )
}

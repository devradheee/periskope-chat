import { redirect } from "next/navigation"
import { createServerClient } from "@/lib/supabase-server"
import ChatLayout from "@/components/chat-layout"
import { getDemoData } from "@/lib/demo-data"

export default async function ChatPage({ params }: { params: { id: string } }) {
  // Check if we have Supabase credentials
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If we have credentials, use the real Supabase client
  if (supabaseUrl && supabaseAnonKey) {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      redirect("/login")
    }

    // Fetch user data
    const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

    // Fetch conversations
    const { data: conversations } = await supabase
      .from("conversations")
      .select(`
        *,
        conversation_members!inner(user_id),
        last_message:messages(content, created_at, sender_id)
      `)
      .eq("conversation_members.user_id", session.user.id)
      .order("updated_at", { ascending: false })
      .limit(50)

    // Process conversations to get the last message
    const processedConversations =
      conversations?.map((conversation) => {
        const lastMessage = conversation.last_message?.[0] || null
        return {
          ...conversation,
          last_message: lastMessage,
        }
      }) || []

    // Fetch messages for the current conversation
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", params.id)
      .order("created_at", { ascending: true })

    // Fetch conversation details
    const { data: conversationDetails } = await supabase
      .from("conversations")
      .select(`
        *,
        conversation_members(user_id, users(id, name, avatar_url))
      `)
      .eq("id", params.id)
      .single()

    return (
      <ChatLayout
        user={userData || { id: session.user.id, name: session.user.email?.split("@")[0] || "User", avatar_url: null }}
        initialConversations={processedConversations}
        activeConversationId={params.id}
        initialMessages={messages || []}
        conversationDetails={conversationDetails}
      />
    )
  }

  // Otherwise use demo data
  const { user, conversations, messages, conversationDetails } = getDemoData(params.id)

  return (
    <ChatLayout
      user={user}
      initialConversations={conversations}
      activeConversationId={params.id}
      initialMessages={messages}
      conversationDetails={conversationDetails}
    />
  )
}

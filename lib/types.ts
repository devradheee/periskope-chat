export interface User {
  id: string
  name: string
  avatar_url: string | null
  email?: string
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  created_at: string
  attachment_url?: string | null
  attachment_type?: string | null
}

export interface Conversation {
  id: string
  name: string
  avatar_url?: string | null
  last_message?: Message | null
  unread_count?: number
  labels?: string[]
  updated_at: string
  created_at: string
}

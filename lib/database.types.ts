export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          avatar_url: string | null
          is_group: boolean
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          avatar_url?: string | null
          is_group?: boolean
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          avatar_url?: string | null
          is_group?: boolean
          metadata?: Json | null
        }
      }
      conversation_members: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          created_at: string
          role: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          created_at?: string
          role?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          created_at?: string
          role?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          created_at: string
          attachment_url: string | null
          attachment_type: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          attachment_url?: string | null
          attachment_type?: string | null
          metadata?: Json | null
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string
          avatar_url: string | null
          metadata: Json | null
        }
        Insert: {
          id: string
          created_at?: string
          name: string
          email: string
          avatar_url?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string
          avatar_url?: string | null
          metadata?: Json | null
        }
      }
      labels: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      conversation_labels: {
        Row: {
          id: string
          conversation_id: string
          label_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          label_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          label_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

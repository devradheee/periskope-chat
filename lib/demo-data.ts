import type { User, Conversation, Message } from "./types"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)

// Create demo user
const demoUser: User = {
  id: "demo-user-id",
  name: "Demo User",
  avatar_url: null,
}

// Create demo conversations
const createDemoConversations = (): Conversation[] => {
  return [
    {
      id: "conv-1",
      name: "John Smith",
      avatar_url: null,
      last_message: {
        id: "msg-1",
        conversation_id: "conv-1",
        sender_id: "john-id",
        content: "Hello, I need help with my order",
        created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      unread_count: 2,
      labels: ["Support"],
      updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      id: "conv-2",
      name: "Sarah Johnson",
      avatar_url: null,
      last_message: {
        id: "msg-2",
        conversation_id: "conv-2",
        sender_id: "demo-user-id",
        content: "I'll check on that for you right away",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      unread_count: 0,
      labels: ["Sales", "Priority"],
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    },
    {
      id: "conv-3",
      name: "Marketing Team",
      avatar_url: null,
      last_message: {
        id: "msg-3",
        conversation_id: "conv-3",
        sender_id: "team-member-id",
        content: "Let's discuss the new campaign tomorrow",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      unread_count: 5,
      labels: ["Internal"],
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    },
  ]
}

// Create demo messages for a conversation
const createDemoMessages = (conversationId: string): Message[] => {
  if (conversationId === "conv-1") {
    return [
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "john-id",
        content: "Hello, I need help with my order #12345",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content: "Hi John, I'd be happy to help. What seems to be the issue with your order?",
        created_at: new Date(Date.now() - 1000 * 60 * 55).toISOString(), // 55 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "john-id",
        content: "I ordered a product last week but it hasn't arrived yet",
        created_at: new Date(Date.now() - 1000 * 60 * 50).toISOString(), // 50 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content: "I understand your concern. Let me check the status of your order right away.",
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "john-id",
        content: "Thank you, I appreciate it",
        created_at: new Date(Date.now() - 1000 * 60 * 40).toISOString(), // 40 minutes ago
      },
    ]
  } else if (conversationId === "conv-2") {
    return [
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "sarah-id",
        content: "Hi, I'm interested in your enterprise plan",
        created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content: "Hello Sarah! I'd be happy to tell you more about our enterprise offerings.",
        created_at: new Date(Date.now() - 1000 * 60 * 115).toISOString(), // 115 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "sarah-id",
        content: "Great! What kind of features are included?",
        created_at: new Date(Date.now() - 1000 * 60 * 110).toISOString(), // 110 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content:
          "Our enterprise plan includes dedicated support, advanced analytics, and custom integrations. Would you like me to send you a detailed brochure?",
        created_at: new Date(Date.now() - 1000 * 60 * 105).toISOString(), // 105 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "sarah-id",
        content: "Yes, please. Also, do you offer a trial period?",
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 60 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content: "I'll check on that for you right away",
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
    ]
  } else {
    return [
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "team-member-id",
        content: "Hey team, we need to discuss the Q4 marketing strategy",
        created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "demo-user-id",
        content: "I've been working on some ideas. When would be a good time to meet?",
        created_at: new Date(Date.now() - 1000 * 60 * 175).toISOString(), // 175 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "another-team-member-id",
        content: "How about tomorrow at 2pm?",
        created_at: new Date(Date.now() - 1000 * 60 * 170).toISOString(), // 170 minutes ago
      },
      {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: "team-member-id",
        content: "Works for me. Let's discuss the new campaign tomorrow",
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
    ]
  }
}

// Create demo conversation details
const createDemoConversationDetails = (conversationId: string) => {
  if (conversationId === "conv-1") {
    return {
      id: conversationId,
      name: "John Smith",
      avatar_url: null,
      is_group: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      conversation_members: [
        {
          user_id: "demo-user-id",
          users: {
            id: "demo-user-id",
            name: "Demo User",
            avatar_url: null,
          },
        },
        {
          user_id: "john-id",
          users: {
            id: "john-id",
            name: "John Smith",
            avatar_url: null,
          },
        },
      ],
    }
  } else if (conversationId === "conv-2") {
    return {
      id: conversationId,
      name: "Sarah Johnson",
      avatar_url: null,
      is_group: false,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      conversation_members: [
        {
          user_id: "demo-user-id",
          users: {
            id: "demo-user-id",
            name: "Demo User",
            avatar_url: null,
          },
        },
        {
          user_id: "sarah-id",
          users: {
            id: "sarah-id",
            name: "Sarah Johnson",
            avatar_url: null,
          },
        },
      ],
    }
  } else {
    return {
      id: conversationId,
      name: "Marketing Team",
      avatar_url: null,
      is_group: true,
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      conversation_members: [
        {
          user_id: "demo-user-id",
          users: {
            id: "demo-user-id",
            name: "Demo User",
            avatar_url: null,
          },
        },
        {
          user_id: "team-member-id",
          users: {
            id: "team-member-id",
            name: "Alex Wilson",
            avatar_url: null,
          },
        },
        {
          user_id: "another-team-member-id",
          users: {
            id: "another-team-member-id",
            name: "Emma Davis",
            avatar_url: null,
          },
        },
      ],
    }
  }
}

// Export function to get demo data
export const getDemoData = (conversationId?: string) => {
  const conversations = createDemoConversations()

  return {
    user: demoUser,
    conversations,
    messages: conversationId ? createDemoMessages(conversationId) : [],
    conversationDetails: conversationId ? createDemoConversationDetails(conversationId) : null,
  }
}

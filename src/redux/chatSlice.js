import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios.js";


// ✅ Fetch Users
export const fetchUsers = createAsyncThunk(
  "chat/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/message/all-employees");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch users");
    }
  }
);

// ✅ Fetch All Conversations (Inbox)
export const fetchConversations = createAsyncThunk(
  "chat/fetchConversations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/v1/message/conversations");
      return response.data.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch conversations");
    }
  }
);

// ✅ Start Generic Chat (from navbar)
export const startConversation = createAsyncThunk(
  "chat/startConversation",
  async (formValues, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/message/conversation-start", formValues);
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to start conversation");
    }
  }
);

// ✅ Open Chat (from product page)
export const openChat = createAsyncThunk(
  "chat/openChat",
  async ({ sellerId, productId, productName }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/message/open-chat", {
        sellerId,
        productId,
        productName,
      });
      return response.data.data.conversation;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to open chat");
    }
  }
);

// ✅ Send Message
export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ conversationId, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/v1/message/send-message", {
        conversationId,
        message,
      });
      return response.data.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to send message");
    }
  }
);

// ✅ Mark as Seen
export const markAsSeen = createAsyncThunk(
  "chat/markAsSeen",
  async (conversationId, { rejectWithValue }) => {
    try {
      await axios.patch(`/api/v1/message/seen/${conversationId}`);
      return conversationId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as seen");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    conversations: [],
    users: [],
    currentConversation: null,
    isLoading: false,
    error: null,
  },
  reducers: {
    setCurrentConversation(state, action) {
      state.currentConversation = action.payload;
    },
    updateUserStatus(state, action) {
      state.conversations = state.conversations.map((conv) => ({
        ...conv,
        participants: conv.participants.map((p) =>
          p._id === action.payload.userId
            ? { ...p, status: action.payload.status }
            : p
        ),
      }));
    },
    addMessage(state, action) {
      const { conversationId, message } = action.payload;
      const conversation = state.conversations.find((c) => c._id === conversationId);
      if (conversation) {
        conversation.messages = [...(conversation.messages || []), message];
        conversation.lastMessage = message.content;
      }
    },
    markMessagesAsSeen(state, action) {
      const { conversationId, userId } = action.payload;
      const conversation = state.conversations.find((c) => c._id === conversationId);
      if (conversation) {
        conversation.messages = conversation.messages.map((msg) =>
          msg.seenBy?.includes(userId)
            ? msg
            : { ...msg, seenBy: [...(msg.seenBy || []), userId] }
        );
      }
    },
    flagMessageInStore(state, action) {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations.find((c) => c._id === conversationId);
      if (conversation) {
        conversation.messages = conversation.messages.map((msg) =>
          msg._id === messageId ? { ...msg, flagged: true } : msg
        );
      }
    },
    replaceChatHistory(state, action) {
      const { conversationId, history } = action.payload;
      const conversation = state.conversations.find((c) => c._id === conversationId);
      if (conversation) {
        conversation.messages = history;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch Conversations
      .addCase(fetchConversations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Start Conversation (generic)
      .addCase(startConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        const existing = state.conversations.find((c) => c._id === action.payload._id);
        if (existing) {
          Object.assign(existing, action.payload);
        } else {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(startConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Open Product Chat
      .addCase(openChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(openChat.fulfilled, (state, action) => {
        state.isLoading = false;
        const existing = state.conversations.find((c) => c._id === action.payload._id);
        if (existing) {
          Object.assign(existing, action.payload);
        } else {
          state.conversations.unshift(action.payload);
        }
      })
      .addCase(openChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        const message = action.payload;
        const conversation = state.conversations.find((c) =>
          c.messages?.some((m) => m._id === message._id) || c._id === message.conversationId
        );
        if (conversation) {
          conversation.messages = [...(conversation.messages || []), message];
          conversation.lastMessage = message.content;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Mark As Seen
      .addCase(markAsSeen.fulfilled, (state, action) => {
        const conversation = state.conversations.find((c) => c._id === action.payload);
        if (conversation) {
          // Optionally: set a flag or update seenBy if needed
        }
      });
  },
});

export default chatSlice.reducer;

export const {
  setCurrentConversation,
  updateUserStatus,
  addMessage,
  markMessagesAsSeen,
  flagMessageInStore,
  replaceChatHistory,
} = chatSlice.actions;

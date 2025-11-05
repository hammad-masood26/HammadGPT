import { useEffect, useState } from "react";
import api from "../api/axios";
// import { useAuth } from "../context/AuthContext";

type Conversation = {
  _id: string;
  title?: string;
  updatedAt: string;
};

type SidebarProps = {
  onSelect: (id: string) => void;
  conversationId: string | null;
  setConversationId: (id: string | null) => void;
  setMessages: (messages: any[]) => void;
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({
  onSelect,
  conversationId,
  setConversationId,
  setMessages,
  isOpen,
  onClose,
}: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // const { user } = useAuth();

  // 🔁 Fetch user conversations
  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  async function fetchConversations() {
    try {
      setError(null);
      const { data } = await api.get("/api/chat/conversations");
      const convos = data.conversations || [];
      setConversations(
        convos.sort(
          (a: Conversation, b: Conversation) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
      );
    } catch (err) {
      console.error("Failed to load conversations", err);
      setError("Failed to fetch conversations");
      setConversations([]);
    } finally {
      setLoading(false);
    }
  }

  // 🗑 Delete specific conversation
  async function deleteConversation(id: string) {
    try {
      await api.delete(`/api/chat/conversation/${id}`);
      setConversations((prev) => prev.filter((c) => c._id !== id));
      if (conversationId === id) {
        setConversationId(null);
        setMessages([]);
        localStorage.removeItem("conversationId");
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  }

  // 🆕 Start brand-new chat (NO welcome message — just clean screen)
  function startNewChat() {
    setConversationId(null);
    setMessages([]); // ✅ clears all messages
    localStorage.removeItem("conversationId");
    onClose(); // ✅ optional: close sidebar when new chat is created
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-full w-64 bg-gray-200 text-gray-900 p-4 flex flex-col shadow-md transform transition-transform duration-300 z-40
      ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-2">
        <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 text-xl font-bold transition"
        >
          ✖
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        {loading && <p className="text-gray-500">Loading chats...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && !error && conversations.length === 0 && (
          <p className="text-gray-500">No chats yet</p>
        )}

        {!loading &&
          !error &&
          conversations.map((c) => (
            <div
              key={c._id}
              className={`flex justify-between items-center p-2 rounded cursor-pointer transition 
              ${
                conversationId === c._id
                  ? "bg-gray-400 text-gray-900"
                  : "bg-gray-100 hover:bg-gray-300"
              }`}
            >
              <button
                onClick={() => onSelect(c._id)}
                className="flex-1 text-left truncate"
              >
                {c.title || "Untitled Chat"}
              </button>
              <button
                onClick={() => deleteConversation(c._id)}
                className="ml-2 text-red-500 hover:text-red-600 transition"
                title="Delete conversation"
              >
                🗑
              </button>
            </div>
          ))}
      </div>

      {/* Footer - New Chat Button */}
      <button
        onClick={startNewChat}
        className="mt-4 bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-md font-semibold transition"
      >
        + New Chat
      </button>
    </aside>
  );
}

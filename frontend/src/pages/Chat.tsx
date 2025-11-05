import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import Sidebar from "./Sidebar";

type Message = { role: "user" | "assistant"; content: string; createdAt?: string };

export default function Chat() {
  const { user, logout, setUser } = useAuth();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  // stopGeneration state previously used for UI; replaced by stopRef for runtime checks
  const stopRef = useRef(false);
  const endRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  // user's initial for avatar (first letter of name or email prefix)
  const userInitial = (user?.name && user.name.trim().charAt(0).toUpperCase()) ||
    (user?.email && user.email.split('@')[0].trim().charAt(0).toUpperCase()) ||
    'U';

  // ✅ Only show welcome message for very first session (not for new chats)
  useEffect(() => {
    if (!conversationId && messages.length === 0) {
      setMessages([]);
    }
  }, [conversationId]);

  // Auto-scroll to latest message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // Cleanup animation interval on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current as number);
      }
    };
  }, []);

  // Restore user and conversation from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) setUser(JSON.parse(savedUser));

    const savedConversationId = localStorage.getItem("conversationId");
    if (savedConversationId) loadConversation(savedConversationId);
  }, [user, setUser]);

  // Load previous conversation
  async function loadConversation(id: string) {
    try {
      const { data } = await api.get(`/api/chat/conversation/${id}`);
      if (!data.conversation?._id) throw new Error("Invalid conversation data");

      setConversationId(data.conversation._id);
      localStorage.setItem("conversationId", data.conversation._id);

      const sortedMessages = (data.conversation.messages || []).sort((a: Message, b: Message) => {
        if (a.createdAt && b.createdAt) {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      });

      setMessages(sortedMessages);
    } catch (e: any) {
      console.error("Failed to load conversation", e);
      localStorage.removeItem("conversationId");
      setConversationId(null);
    }
  }

  // ✅ New Chat clears messages completely
  function newChat() {
    setConversationId(null);
    localStorage.removeItem("conversationId");
    setMessages([]);
    setInput("");
  }

  // Send message
  const sendMessage = async () => {
    const content = input.trim();
    if (!content) return;

    setInput("");
    const userMessage: Message = { role: "user", content };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
  setTyping(true);
  setIsGenerating(true);
  stopRef.current = false;

    try {
      const { data } = await api.post("/api/chat/ask", {
        conversationId,
        message: content,
      });

      if (data.conversationId) {
        setConversationId(data.conversationId);
        localStorage.setItem("conversationId", data.conversationId);
      }

  if (data.conversation?.messages && !stopRef.current) {
        const allMsgs = data.conversation.messages;
        const lastMsg = allMsgs[allMsgs.length - 1];

        if (lastMsg?.role === "assistant") {
          // Start animated response
          let currentContent = "";
          const fullContent = lastMsg.content;
          const chunkSize = 3; // Characters to add per frame
          let index = 0;

          setMessages([...allMsgs.slice(0, -1), { role: "assistant", content: "" }]);

          const animate = () => {
            if (stopRef.current) {
              // Keep the partial response if stopped
              setMessages([...allMsgs.slice(0, -1), { role: "assistant", content: currentContent }]);
              setIsGenerating(false);
              setTyping(false);
              return;
            }

            // Compute next index to include the final characters correctly
            const nextIndex = Math.min(index + chunkSize, fullContent.length);
            currentContent = fullContent.slice(0, nextIndex);
            setMessages([...allMsgs.slice(0, -1), { role: "assistant", content: currentContent }]);

            index = nextIndex;
            if (index < fullContent.length) {
              animationRef.current = window.setTimeout(animate, 20);
            } else {
              // Completed
              setIsGenerating(false);
              setTyping(false);
            }
          };

          animate();
        } else {
          setMessages(allMsgs);
        }
      }
    } catch (e: any) {
      console.error("Error sending message:", e);
      setMessages([
        ...nextMessages,
        {
          role: "assistant",
          content: e?.response?.data?.error || "Sorry, something went wrong.",
        },
      ]);
      if (e?.response?.status === 401) {
        localStorage.removeItem("conversationId");
        setConversationId(null);
      }
    } finally {
      setTyping(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-white to-gray-100 text-gray-900">
      {/* Sidebar */}
      <Sidebar
        onSelect={loadConversation}
        conversationId={conversationId}
        setConversationId={setConversationId}
        setMessages={setMessages}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <header className="sticky top-0 z-20 px-6 py-3 bg-gray-100 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="bg-gray-200 text-gray-800 px-3 py-2 rounded-md hover:bg-gray-300 transition"
              >
                ☰
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800">HammadGPT</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 text-sm">{user?.email}</span>
            <button
              onClick={newChat}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm"
            >
              New Chat
            </button>
            <button
              onClick={() => {
                logout();
                localStorage.removeItem("user");
                localStorage.removeItem("conversationId");
              }}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Chat Messages */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 bg-gray-50">
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.length === 0 && !conversationId ? (
              <div className="flex flex-col items-center justify-center h-[70vh] text-center">
                <h2 className="text-4xl font-semibold text-gray-700 mb-3">
                  👋 Welcome {user?.email?.split("@")[0] || "there"}!
                </h2>
                <p className="text-gray-500 text-lg">
                  Start a new conversation by asking anything below.
                </p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                    m.role === "user" ? 'bg-blue-600 order-2' : 'bg-blue-700 order-1'
                  }`}> 
                    {m.role === 'user' ? userInitial : 'AI'}
                  </div>

                  <div className={`max-w-[75%] ${m.role === 'user' ? 'order-1 text-right' : 'order-2 text-left'}`}>
                    <div className={`p-4 rounded-2xl shadow-sm border transition-all ${
                      m.role === "user"
                        ? "bg-blue-100 border-blue-200 text-gray-900"
                        : "bg-gradient-to-r from-blue-700 to-blue-600 border-blue-700 text-white"
                    }`}> 
                      <div className="prose max-w-none break-words whitespace-pre-wrap">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-1 text-xs text-gray-400">
                      <div>
                        {m.createdAt ? new Date(m.createdAt).toLocaleString() : null}
                      </div>
                      {m.role === 'assistant' && (
                        <button
                          onClick={() => navigator.clipboard.writeText(m.content)}
                          className="ml-2 text-gray-300 hover:text-white text-sm px-2 py-1 rounded-sm"
                          title="Copy response"
                        >
                          Copy
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {typing && (
              <div className="flex justify-start">
                <div className="p-3 px-4 bg-gray-200 border border-gray-300 rounded-2xl">
                  <div className="flex space-x-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={endRef} />
          </div>
        </main>

        {/* Input */}
        <footer className="sticky bottom-0 p-4 bg-gray-100 border-t border-gray-200">
          <form onSubmit={onSubmit} className="max-w-3xl mx-auto flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white border border-gray-300 rounded-xl px-4 py-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (!typing && input.trim()) sendMessage();
                  }
                }}
              />
              {isGenerating ? (
                <button
                  type="button"
                  onClick={() => {
                    stopRef.current = true;
                    if (animationRef.current) {
                      clearTimeout(animationRef.current as number);
                      animationRef.current = null;
                    }
                    setIsGenerating(false);
                    setTyping(false);
                  }}
                  className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="6" y="6" width="8" height="8" />
                  </svg>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={typing || !input.trim()}
                  className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 5v10l8-5-8-5z" />
                  </svg>
                </button>
              )}
            </div>
          </form>
        </footer>
      </div>
    </div>
  );
}

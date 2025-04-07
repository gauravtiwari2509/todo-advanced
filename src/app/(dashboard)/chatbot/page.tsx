"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { FaPaperPlane, FaRobot, FaUser } from "react-icons/fa";
import { marked } from "marked";
import DOMPurify from "dompurify";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatbotPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `# Welcome to TaskMaster Pro AI Assistant! 👋

I'm here to help you manage your tasks more effectively. Here are some things I can do:

- **Help you organize your tasks** by suggesting priorities or categories
- **Provide insights** about your productivity patterns
- **Answer questions** about task management best practices
- **Suggest improvements** to your workflow

Feel free to ask me anything about your tasks or how to use this application more effectively!`,
        },
      ]);
    }
  }, [messages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Add assistant message to chat
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Render markdown content safely
  const renderMarkdown = (content: string) => {
    // Use marked.parse with the correct type handling
    const htmlContent = marked.parse(content) as string;
    const sanitizedHtml = DOMPurify.sanitize(htmlContent);
    return <div dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
  };

  return (
    <div className="flex flex-col h-[80vh] bg-gray-900">
      <div className="p-4 bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-white">AI Assistant</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}
            >
              <div className="flex items-center mb-2">
                {message.role === "user" ? (
                  <FaUser className="mr-2 text-blue-300" />
                ) : (
                  <FaRobot className="mr-2 text-green-400" />
                )}
                <span className="font-medium">
                  {message.role === "user" ? "You" : "AI Assistant"}
                </span>
              </div>
              <div className="prose prose-invert max-w-none">
                {renderMarkdown(message.content)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-gray-800">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-white rounded-full animate-bounce"
                  style={{ animationDelay: "0.4s" }}
                ></div>
              </div>
            ) : (
              <FaPaperPlane />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import "./App.css";

export default function AIChat() {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const isSendDisabled = loading || !prompt.trim();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMsg = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt("");
    setLoading(true);

    try {
      const response = await axios.post("https://ai-chatbot-backend-2-zhwh.onrender.com/api/ask-ai", {
        prompt,
      });
      const aiMsg = { role: "assistant", content: response.data.reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: " + error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#0a0a0a] text-white font-[Poppins]">
      {/* Background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black" />
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl h-[85vh] bg-white/10 backdrop-blur-2xl border border-white/20 
                   rounded-3xl shadow-[0_0_50px_rgba(79,70,229,0.3)] flex flex-col overflow-hidden m-4"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-6 px-6 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-pink-600/20 border-b border-white/20"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-2xl shadow-lg">
              🤖
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
                AI Chatbot
              </h1>
              <p className="text-sm text-gray-300 mt-0.5">Your Smart Assistant</p>
            </div>
          </div>
        </motion.div>

        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-indigo-600 scrollbar-track-transparent">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center h-full text-center space-y-4"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-5xl shadow-2xl">
                💬
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-200">Start a Conversation</h2>
                <p className="text-gray-400 mt-2 max-w-md">
                  Ask me anything! I'm here to help with questions, ideas, or just a friendly chat.
                </p>
              </div>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant Avatar */}
              {msg.role === "assistant" && (
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg flex-shrink-0">
                  🤖
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`max-w-[75%] px-5 py-3.5 rounded-2xl leading-relaxed shadow-lg transition-all hover:shadow-xl ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white rounded-tr-none"
                    : "bg-white/95 text-gray-900 rounded-tl-none border border-gray-200"
                }`}
              >
                <p className="whitespace-pre-wrap break-words">{msg.content}</p>
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-xl shadow-lg flex-shrink-0">
                  👤
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-xl shadow-lg">
                🤖
              </div>
              <div className="bg-white/95 px-5 py-3.5 rounded-2xl rounded-tl-none shadow-lg flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-gray-600 text-sm ml-2">AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input area */}
        <div className="relative flex items-end gap-3 p-6 bg-[#0f172a]/80 backdrop-blur-lg border-t border-white/10">
          <textarea
            className="flex-1 bg-[#1e293b]/80 text-white placeholder-gray-400 rounded-2xl 
                       px-5 py-4 resize-none border border-gray-600/50 focus:ring-2 
                       focus:ring-indigo-500 focus:outline-none focus:border-indigo-500/50 
                       transition-all shadow-inner text-base min-h-[60px] max-h-[120px]"
            rows="1"
            placeholder="Type your message here..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={handleSend}
            disabled={isSendDisabled}
            title={isSendDisabled ? "Type a message or wait..." : "Send message"}
            sx={{
              borderRadius: 4,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #63408a 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              },
              '&:disabled': {
                background: 'linear-gradient(135deg, #4a5568 0%, #2d3748 100%)',
                color: '#718096',
              }
            }}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

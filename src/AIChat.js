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
      const response = await axios.post(
        "https://ai-chatbot-backend-2-zhwh.onrender.com/api/ask-ai",
        { prompt }
      );
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
    <div style={styles.container}>
      {/* Background Effects */}
      <div style={styles.bgGradient}></div>
      <div style={styles.bgBlob1}></div>
      <div style={styles.bgBlob2}></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        style={styles.chatBox}
      >
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div style={styles.avatar}>🤖</div>
            <div>
              <h1 style={styles.title}>AI Chatbot</h1>
              <p style={styles.subtitle}>Your Smart Assistant</p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div style={styles.messagesArea}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.emptyState}
            >
              <div style={styles.emptyIcon}>💬</div>
              <h2 style={styles.emptyTitle}>Start a Conversation</h2>
              <p style={styles.emptyText}>
                Ask me anything! I'm here to help with questions, ideas, or just
                a friendly chat.
              </p>
            </motion.div>
          )}

          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 50 : -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                ...styles.messageRow,
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              {msg.role === "assistant" && (
                <div style={styles.botAvatar}>🤖</div>
              )}

              <div
                style={{
                  ...styles.messageBubble,
                  ...(msg.role === "user"
                    ? styles.userBubble
                    : styles.botBubble),
                }}
              >
                {msg.content}
              </div>

              {msg.role === "user" && <div style={styles.userAvatar}>👤</div>}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={styles.messageRow}
            >
              <div style={styles.botAvatar}>🤖</div>
              <div style={styles.typingBubble}>
                <div style={styles.typingDots}>
                  <span style={{ ...styles.dot, animationDelay: "0ms" }}>
                    •
                  </span>
                  <span style={{ ...styles.dot, animationDelay: "150ms" }}>
                    •
                  </span>
                  <span style={{ ...styles.dot, animationDelay: "300ms" }}>
                    •
                  </span>
                </div>
                <span style={styles.typingText}>AI is thinking...</span>
              </div>
            </motion.div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* Input Area */}
        <div style={styles.inputArea}>
          <textarea
            style={styles.textarea}
            rows="2"
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
            sx={buttonStyles}
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

// Styles Object
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0a0a0a",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
    fontFamily: "'Poppins', sans-serif",
  },
  bgGradient: {
    position: "absolute",
    inset: 0,
    background: "radial-gradient(ellipse at top, rgba(79, 70, 229, 0.3), transparent)",
  },
  bgBlob1: {
    position: "absolute",
    top: "-150px",
    left: "-150px",
    width: "400px",
    height: "400px",
    background: "rgba(59, 130, 246, 0.15)",
    borderRadius: "50%",
    filter: "blur(80px)",
    animation: "pulse 4s ease-in-out infinite",
  },
  bgBlob2: {
    position: "absolute",
    bottom: "-150px",
    right: "-150px",
    width: "400px",
    height: "400px",
    background: "rgba(168, 85, 247, 0.15)",
    borderRadius: "50%",
    filter: "blur(80px)",
    animation: "pulse 4s ease-in-out infinite 2s",
  },
  chatBox: {
    position: "relative",
    width: "100%",
    maxWidth: "900px",
    height: "85vh",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    borderRadius: "24px",
    boxShadow: "0 0 50px rgba(79, 70, 229, 0.3)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    padding: "24px",
    background: "linear-gradient(to right, rgba(79, 70, 229, 0.3), rgba(168, 85, 247, 0.2))",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  avatar: {
    width: "48px",
    height: "48px",
    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    background: "linear-gradient(to right, #60a5fa, #a78bfa, #f472b6)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#d1d5db",
    margin: 0,
  },
  messagesArea: {
    flex: 1,
    overflowY: "auto",
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    textAlign: "center",
  },
  emptyIcon: {
    width: "96px",
    height: "96px",
    background: "linear-gradient(135deg, #3b82f6, #a855f7)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "48px",
    marginBottom: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  emptyTitle: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#e5e7eb",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#9ca3af",
    maxWidth: "400px",
    margin: 0,
  },
  messageRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
  },
  botAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #3b82f6, #4f46e5)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  userAvatar: {
    width: "40px",
    height: "40px",
    background: "linear-gradient(135deg, #4b5563, #1f2937)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    flexShrink: 0,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "14px 18px",
    borderRadius: "16px",
    fontSize: "15px",
    lineHeight: "1.6",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  userBubble: {
    background: "linear-gradient(135deg, #2563eb, #4f46e5, #7c3aed)",
    color: "white",
    borderTopRightRadius: "4px",
  },
  botBubble: {
    background: "rgba(255, 255, 255, 0.95)",
    color: "#111827",
    borderTopLeftRadius: "4px",
    border: "1px solid rgba(229, 231, 235, 0.3)",
  },
  typingBubble: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "14px 18px",
    borderRadius: "16px",
    borderTopLeftRadius: "4px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
  },
  typingDots: {
    display: "flex",
    gap: "4px",
  },
  dot: {
    fontSize: "24px",
    color: "#4f46e5",
    animation: "bounce 1.4s ease-in-out infinite",
  },
  typingText: {
    fontSize: "13px",
    color: "#6b7280",
  },
  inputArea: {
    display: "flex",
    alignItems: "flex-end",
    gap: "12px",
    padding: "24px",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  textarea: {
    flex: 1,
    background: "rgba(30, 41, 59, 0.8)",
    color: "white",
    border: "1px solid rgba(75, 85, 99, 0.5)",
    borderRadius: "16px",
    padding: "16px",
    fontSize: "15px",
    fontFamily: "'Poppins', sans-serif",
    resize: "none",
    outline: "none",
    minHeight: "60px",
    maxHeight: "120px",
    transition: "all 0.2s",
  },
};

const buttonStyles = {
  borderRadius: 3,
  px: 4,
  py: 1.5,
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
  "&:hover": {
    background: "linear-gradient(135deg, #5568d3 0%, #63408a 100%)",
    boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
  },
  "&:disabled": {
    background: "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
    color: "#718096",
  },
};

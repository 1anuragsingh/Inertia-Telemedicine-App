"use client";
import { useState } from "react";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: "ai", text: "Hi! I am the CareSyncra AI. Describe your symptoms, and I'll suggest the best doctor for you." }
  ]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Make sure your backend is running on port 4000!
      const response = await fetch("http://localhost:4000/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      setMessages([...newMessages, { role: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages([...newMessages, { role: "ai", text: "Sorry, I am having trouble connecting to the server right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* The Chat Window */}
      {isOpen && (
        <div className="bg-white border-2 rounded-lg shadow-xl w-80 sm:w-96 h-[28rem] mb-4 flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white p-4 font-bold flex justify-between items-center">
            <span>AI Care Navigator</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              ✕
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`mb-3 p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-blue-100 text-blue-900 ml-auto rounded-br-none' : 'bg-white border text-gray-800 mr-auto rounded-bl-none'} max-w-[85%] w-fit shadow-sm`}>
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-gray-400 italic text-sm ml-2">AI is typing...</div>}
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms..."
              className="flex-1 border p-2 rounded-lg outline-none text-sm focus:border-blue-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
              Send
            </button>
          </div>
        </div>
      )}

      {/* The Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-105"
        >
          {/* Simple Chat Icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          </svg>
        </button>
      )}
    </div>
  );
}
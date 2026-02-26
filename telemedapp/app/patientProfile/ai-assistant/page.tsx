"use client";
import { useState } from "react";

export default function AIChatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;

    // Add user message to UI
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      // Send to your backend
      const response = await fetch("http://localhost:4000/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      
      const data = await response.json();
      
      // Add AI reply to UI
      setMessages([...newMessages, { role: "ai", text: data.reply }]);
    } catch (error) {
      console.error("Chat error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto border-2 rounded-lg p-4 bg-white shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-blue-600">AI Care Navigator</h2>
      
      <div className="h-64 overflow-y-auto mb-4 border-b p-2">
        {messages.map((msg, i) => (
          <div key={i} className={`mb-2 p-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-100 text-right ml-auto' : 'bg-gray-100 mr-auto'} max-w-[80%]`}>
            {msg.text}
          </div>
        ))}
        {loading && <div className="text-gray-400 italic">Thinking...</div>}
      </div>

      <div className="flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe your symptoms or mood..."
          className="flex-1 border p-2 rounded-lg outline-none"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">
          Send
        </button>
      </div>
    </div>
  );
}
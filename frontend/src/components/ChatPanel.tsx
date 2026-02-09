import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (res.body) {
        // Add empty AI message that we'll stream into
        setMessages((prev) => [...prev, { role: "ai", content: "" }]);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let full = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          full += decoder.decode(value);
          const captured = full;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "ai", content: captured };
            return updated;
          });
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Errore di connessione con Fiammetta." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm flex flex-col h-[500px] lg:h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
          <img src="/logo-trasparente.webp" alt="Fiammetta" className="w-6 h-6 object-contain" />
          Fiammetta AI
        </h3>
        <span className="text-xs px-2.5 py-1 bg-orange-900/30 text-orange-300 rounded-full border border-orange-800/50">
          Llama 3.2
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-slate-500 text-sm text-center mt-8">
            Ciao! Sono Fiammetta. Chiedimi della caldaia, pressione, manutenzione...
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-2 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "ai" && (
              <img src="/logo-trasparente.webp" alt="Fiammetta" className="w-7 h-7 rounded-full object-contain shrink-0 mt-1" />
            )}
            <div
              className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-slate-700/70 text-slate-200 rounded-bl-md"
              }`}
            >
              {msg.content || (
                <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse rounded-sm" />
              )}
            </div>
            {msg.role === "user" && (
              <div className="w-7 h-7 rounded-full bg-blue-900/50 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-blue-400" />
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Chiedi a Fiammetta..."
            disabled={isTyping}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 disabled:opacity-50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isTyping || !input.trim()}
            className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-blue-600"
          >
            <Send className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Sparkles, X, RotateCcw } from "lucide-react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatTweakDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const QUICK_CHIPS = [
  "Swap Day 2 dinner for something else",
  "Make lunch prep faster and more portable",
  "I don't have red lentil pasta—what should I substitute?",
  "Give me an alternate breakfast for Day 4",
  "Can you consolidate the grocery list again?",
];

export const ChatTweakDrawer: React.FC<ChatTweakDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleChipClick = (chip: string) => {
    onSendMessage(chip);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white border-l border-stone-200 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-700 text-white rounded-lg">
            <MessageSquare className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-serif font-bold text-base text-stone-900">
              Coach Chat & Plan Tweaks
            </h3>
            <p className="text-[11px] text-stone-500">
              Ask to swap any meal, tweak ingredients, or adjust your prep plan.
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition"
          aria-label="Close chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Chips */}
      <div className="px-4 py-2.5 bg-stone-100/70 border-b border-stone-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-[10px] font-semibold uppercase text-stone-500 shrink-0">
          Try:
        </span>
        {QUICK_CHIPS.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            className="text-[11px] bg-white border border-stone-200 text-stone-700 px-2.5 py-1 rounded-full whitespace-nowrap hover:border-emerald-600 hover:text-emerald-800 transition shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-stone-50/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-700 text-white rounded-br-xs shadow-xs"
                  : "bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-2xs whitespace-pre-wrap"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 text-stone-600 rounded-2xl rounded-bl-xs p-3.5 shadow-2xs flex items-center gap-1.5 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.3s]" />
              <span className="text-stone-500 ml-1">Coach is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Row */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a request (e.g. Swap Day 3 lunch for a wrap)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-600"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition shadow-xs"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

import { useState } from "react";
import { Send, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAI } from "../store/aiStore.js";
import {
  pageWrapper,
  pageTitleClass,
  mutedText,
  cardClass,
  inputClass,
  primaryBtn,
  secondaryBtn,
} from "../styles/common.js";

function AIAssistant() {
  const [message, setMessage] = useState("");

  const messages = useAI((state) => state.messages);
  const loading = useAI((state) => state.loading);
  const error = useAI((state) => state.error);
  const sendMessage = useAI((state) => state.sendMessage);
  const clearMessages = useAI((state) => state.clearMessages);

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    const userMessage = message.trim();
    setMessage("");

    const result = await sendMessage(userMessage);

    if (!result.success) {
      toast.error(result.message);
    }
  };

  return (
    <div className={pageWrapper}>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="inline-flex px-4 py-2 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-sm font-bold mb-4">
            AI Assistant
          </p>

          <h1 className={pageTitleClass}>Stock Market Assistant</h1>

          <p className={`${mutedText} mt-2`}>
            Ask questions about stocks, investing, market concepts, and trading
            strategies.
          </p>
        </div>

        {messages.length > 0 && (
          <button onClick={clearMessages} className={secondaryBtn}>
            <Trash2 size={18} />
            Clear Chat
          </button>
        )}
      </div>

      <div className={`${cardClass} p-0 overflow-hidden`}>
        <div className="h-[500px] overflow-y-auto p-5 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center mx-auto mb-4 text-3xl font-bold">
                AI
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Ask anything about stocks
              </h2>

              <p className="text-slate-500 dark:text-gray-400 mt-2">
                Example: Can I invest in Apple?
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-500 text-black"
                      : "bg-slate-100 dark:bg-[#0f1b2e] text-slate-900 dark:text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-100 dark:bg-[#0f1b2e] px-4 py-3 rounded-2xl text-slate-700 dark:text-gray-300">
                Thinking...
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mx-4 mb-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        <div className="border-t border-slate-200 dark:border-white/10 p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={message}
              placeholder="Ask a stock market question..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleSend();
                }
              }}
              className={inputClass}
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className={`${primaryBtn} px-6`}
            >
              <Send size={18} />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIAssistant;
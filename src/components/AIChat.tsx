import { useState, useEffect } from 'react';
import { useAI } from '../hooks/useAI';
import { Bot, Send, Loader2, X, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export default function AIChat() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [input, setInput] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showReminder, setShowReminder] = useState(false);
  const { askAI, isLoading, error } = useAI();

  const formatAIResponse = (content: string): string => {
    return content
      .replace(/#{1,6}\s/g, '') // Удаляем символы заголовков
      .replace(/\*\*(.*?)\*\*/g, '$1') // Удаляем символы жирного текста
      .replace(/\*(.*?)\*/g, '$1') // Удаляем символы курсива
      .replace(/```[\s\S]*?```/g, (match) => { // Обрабатываем блоки кода
        return match.replace(/```([\s\S]*?)```/g, '$1').trim();
      })
      .trim();
  };
  const tokens = useAuthStore((state) => state.tokens);
  const setTokens = useAuthStore((state) => state.setTokens);
  
  // Экспортируем функцию для управления состоянием чата
  window.expandAIChat = () => setIsExpanded(true);

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      if (!isExpanded) {
        setShowReminder(true);
        setTimeout(() => setShowReminder(false), 3000);
      }
    }, 60000);

    return () => clearInterval(reminderInterval);
  }, [isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || tokens <= 0) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await askAI(userMessage);
      if (response) {
        const formattedContent = formatAIResponse(response.content);
        setMessages(prev => [...prev, { role: 'assistant', content: formattedContent }]);
        setTokens(tokens - 1); // Уменьшаем количество токенов
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isExpanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsExpanded(true)}
          className={`group bg-slate-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
            showReminder ? 'animate-bounce' : ''
          }`}
        >
          <MessageSquare className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg overflow-hidden z-50 animate-slide-up">
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-white font-medium">ИИ-ассистент</h3>
            <p className="text-sm text-gray-400">Осталось токенов: {tokens}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-400px)] min-h-[300px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-slate-900'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center text-sm">{error}</div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tokens > 0 ? "Задайте вопрос..." : "Токены закончились"}
            disabled={tokens <= 0}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
            style={{ minHeight: '80px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading || tokens <= 0}
            className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 mt-2 sm:mt-0"
          >
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              <span>Отправить</span>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}
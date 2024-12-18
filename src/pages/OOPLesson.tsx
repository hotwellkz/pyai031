import { useEffect, useState } from 'react';
import { ArrowLeft, Brain, Bot, Code2, CheckCircle, Loader2, BookOpen, Box, Layers } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAI } from '../hooks/useAI';
import { useAuthStore } from '../store/authStore';
import { TTSService } from '../lib/tts-service';

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

const questions: Question[] = [
  {
    question: "Что такое класс в Python?",
    options: [
      "Функция для вычислений",
      "Шаблон для создания объектов",
      "Тип данных для чисел",
      "Модуль для импорта"
    ],
    correctAnswer: 1
  },
  {
    question: "Как создать объект класса Car?",
    options: [
      "Car.new()",
      "new Car()",
      "Car()",
      "create Car"
    ],
    correctAnswer: 2
  },
  {
    question: "Что такое метод класса?",
    options: [
      "Переменная внутри класса",
      "Функция внутри класса",
      "Название класса",
      "Тип данных класса"
    ],
    correctAnswer: 1
  }
];

export default function OOPLesson() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [showReminder, setShowReminder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUsingPremiumVoice, setIsUsingPremiumVoice] = useState(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [promptInput, setPromptInput] = useState('');
  const [suggestedQuestions] = useState([
    "Как реализовать наследование в Python?",
    "Что такое инкапсуляция и как её применять?",
    "Как работает полиморфизм в Python?"
  ]);

  const currentLessonContent = useAuthStore((state) => state.currentLessonContent);
  const setCurrentLessonContent = useAuthStore((state) => state.setCurrentLessonContent);
  const tokens = useAuthStore((state) => state.tokens);
  const completeLesson = useAuthStore((state) => state.completeLesson);
  const setTokens = useAuthStore((state) => state.setTokens);
  const { askAI } = useAI();
  const ttsService = TTSService.getInstance();
  const navigate = useNavigate();

  const formatAIResponse = (content: string): string => {
    return content
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/```[\s\S]*?```/g, (match) => {
        return match.replace(/```([\s\S]*?)```/g, '$1').trim();
      })
      .trim();
  };

  useEffect(() => {
    document.title = 'Основы ООП в Python | Объектно-ориентированное программирование';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Изучите основы объектно-ориентированного программирования в Python: классы, объекты, методы и атрибуты. Практические примеры и интерактивные задания.');
    }
  }, []);

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      setShowReminder(true);
      setTimeout(() => setShowReminder(false), 3000);
    }, 15000);

    return () => clearInterval(reminderInterval);
  }, []);

  const speak = async (text: string) => {
    try {
      setIsPremiumLoading(true);
      setIsLoadingVoice(true);
      setIsSpeaking(true);
      setIsUsingPremiumVoice(true);
      const audioBuffer = await ttsService.synthesizeSpeech(text);
      const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      
      setAudioUrl(url);
      const newAudio = new Audio(url);
      
      newAudio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setIsUsingPremiumVoice(false);
      };
      
      setAudio(newAudio);
      newAudio.play();
    } catch (error) {
      console.error('Error synthesizing speech:', error);
      setIsSpeaking(false);
      alert('Произошла ошибка при озвучивании текста');
    } finally {
      setIsLoadingVoice(false);
      setIsPremiumLoading(false);
    }
  };

  const togglePause = () => {
    if (audio) {
      if (isPaused) {
        audio.play();
        setIsPaused(false);
      } else {
        audio.pause();
        setIsPaused(true);
      }
    }
  };

  const stopSpeaking = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudio(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
        setAudioUrl(null);
      }
    }
    if (utterance) {
      window.speechSynthesis.cancel();
      setUtterance(null);
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setIsUsingPremiumVoice(false);
  };

  const startLesson = async () => {
    setIsLoading(true);
    setError('');

    if (tokens <= 0) {
      alert('У вас закончились токены');
      setIsLoading(false);
      return;
    }

    const prompt = 'Расскажи подробно как будто ты преподаватель и преподаеш урок на тему: Объектно-ориентированное программирование (ООП), Урок 1: Основы ООП, Что такое классы и объекты? Атрибуты и методы класса';
    (window as any).expandAIChat?.();

    try {
      const response = await askAI(prompt);
      if (response) {
        const formattedContent = formatAIResponse(response.content);
        setMessages(prev => [
          ...prev,
          { role: 'user', content: prompt },
          { role: 'assistant', content: formattedContent }
        ]);
        setCurrentLessonContent(formattedContent);
        setTokens(tokens - 5);
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSubmit = (answerIndex: number) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newSelectedAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const newScore = newSelectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === questions[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore((newScore / questions.length) * 10);
      setShowScore(true);
    }
  };

  const handlePromptSubmit = async () => {
    if (!promptInput.trim() || tokens < 5) return;

    try {
      const response = await askAI(promptInput);
      if (response) {
        const formattedContent = formatAIResponse(response.content);
        setMessages(prev => [...prev, 
          { role: 'user', content: promptInput },
          { role: 'assistant', content: formattedContent }
        ]);
        setTokens(tokens - 5);
        setPromptInput('');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка при получении ответа от ИИ');
    }
  };

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/curriculum"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться к программе
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Урок 1: Основы ООП
            </h1>
            <p className="text-xl text-gray-300">
              Изучите основы объектно-ориентированного программирования в Python
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={startLesson}
                  disabled={tokens <= 0 || isLoading}
                  className={`w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 relative ${
                    showReminder ? 'animate-pulse scale-105' : ''
                  } hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-6 h-6" />
                    <span>
                      {isLoading ? (
                        <span className="flex items-center">
                          Готовлю урок
                          <span className="loading-dots ml-1"></span>
                        </span>
                      ) : (
                        'Начать урок с ИИ-учителем'
                      )}
                    </span>
                  </div>
                  {tokens <= 0 && (
                    <p className="text-sm mt-1 text-blue-200">
                      Недостаточно токенов для начала урока
                    </p>
                  )}
                </button>

                {currentLessonContent && (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        if (isSpeaking) {
                          if (!isUsingPremiumVoice) {
                            window.speechSynthesis.cancel();
                            stopSpeaking();
                          } else {
                            stopSpeaking();
                          }
                        } else {
                          const utterance = new SpeechSynthesisUtterance(currentLessonContent);
                          utterance.lang = 'ru-RU';
                          utterance.rate = 0.9;
                          setUtterance(utterance);
                          setIsSpeaking(true);
                          setIsUsingPremiumVoice(false);
                          window.speechSynthesis.speak(utterance);
                          utterance.onend = () => {
                            setIsSpeaking(false);
                            setIsPaused(false);
                            setIsUsingPremiumVoice(false);
                          };
                        }
                      }}
                      className="w-full sm:w-auto bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-gray-50"
                      disabled={isLoadingVoice || (isSpeaking && isUsingPremiumVoice)}
                    >
                      {isSpeaking && !isUsingPremiumVoice ? (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Остановить озвучивание
                        </>
                      ) : (
                        !isLoadingVoice && <>
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                          Озвучить бесплатно
                        </>
                      )}
                    </button>

                    <button
                      disabled={tokens < 45 || isLoadingVoice}
                      onClick={() => {
                        if (tokens < 45) {
                          alert('Недостаточно токенов для озвучивания премиум голосом');
                          return;
                        }
                        if (isSpeaking && !isUsingPremiumVoice) {
                          window.speechSynthesis.cancel();
                          stopSpeaking();
                        }
                        if (isSpeaking) {
                          stopSpeaking();
                        } else {
                          speak(currentLessonContent);
                          setTokens(tokens - 45);
                        }
                      }}
                      className={`w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 ${isLoadingVoice ? 'animate-pulse' : ''}`}
                    >
                      {isSpeaking && isUsingPremiumVoice ? (
                        <>
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          Остановить озвучивание
                        </>
                      ) : isPremiumLoading ? (
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full" />
                          Загрузка премиум голоса
                          <span className="loading-dots"></span>
                        </div>
                      ) : (
                        <>
                          <span className="w-2 h-2 bg-white rounded-full" />
                          Премиум озвучка (45 токенов)
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {isLoading && (
              <div className="mt-4 text-center text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Пожалуйста, подождите. ИИ-учитель готовит материал урока...</p>
              </div>
            )}

            {error && (
              <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}

            {currentLessonContent && (
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8 prose prose-slate max-w-none">
                <div className="flex items-center gap-3 mb-6">
                  <Bot className="w-6 h-6 text-blue-500" />
                  <h2 className="text-xl font-semibold text-slate-900 m-0">
                    Урок от ИИ-преподавателя
                  </h2>
                </div>
                <div className="whitespace-pre-wrap">{currentLessonContent}</div>
              </div>
            )}

            <div 
              ref={contentRef}
              className={`space-y-8 transform transition-all duration-1000 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Классы и объекты */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Box className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Классы и объекты
                  </h2>
                </div>

                <div className="space-y-6">
                  <p className="text-slate-600">
                    Класс - это шаблон для создания объектов, который определяет их свойства и поведение.
                    Объект - это конкретный экземпляр класса.
                  </p>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Пример создания класса и объекта:
                    </h3>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                      <code>{`class Car:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
    
    def display_info(self):
        return f"{self.brand} {self.model}"

# Создание объекта
my_car = Car("Toyota", "Camry")
print(my_car.display_info())  # Toyota Camry`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Атрибуты и методы */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Атрибуты и методы класса
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Атрибуты
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Переменные, хранящие данные объекта</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Определяются в методе __init__</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Доступны через self</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Методы
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Функции, определённые внутри класса</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Описывают поведение объекта</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>Первый параметр всегда self</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-slate-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">
                      Пример использования атрибутов и методов:
                    </h3>
                    <pre className="bg-slate-800 text-white p-4 rounded-lg overflow-x-auto">
                      <code>{`class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner      # Атрибут
        self.balance = balance  # Атрибут
    
    def deposit(self, amount):  # Метод
        self.balance += amount
        return f"Внесено {amount}₽. Баланс: {self.balance}₽"
    
    def withdraw(self, amount): # Метод
        if amount <= self.balance:
            self.balance -= amount
            return f"Снято {amount}₽. Баланс: {self.balance}₽"
        return "Недостаточно средств"

# Создание и использование объекта
account = BankAccount("Иван Петров", 1000)
print(account.deposit(500))   # Внесено 500₽. Баланс: 1500₽
print(account.withdraw(200))  # Снято 200₽. Баланс: 1300₽`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              {/* Тест */}
              {!showScore ? (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Проверьте свои знания
                    </h2>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">
                        Вопрос {currentQuestion + 1} из {questions.length}
                      </h3>
                      <p className="text-slate-700 mb-6">
                        {questions[currentQuestion].question}
                      </p>
                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSubmit(index)}
                            className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                              selectedAnswers[currentQuestion] === index
                                ? 'bg-blue-500 text-white'
                                : 'bg-white hover:bg-blue-50 text-slate-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-8 shadow-sm">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl font-bold text-white">{score.toFixed(1)}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      Ваш результат
                    </h3>
                    <p className="text-slate-600 mb-6">
                      {score >= 8
                        ? 'Отличный результат! Вы хорошо усвоили материал.'
                        : score >= 6
                        ? 'Хороший результат! Но есть куда расти.'
                        : 'Рекомендуем повторить материал урока.'}
                    </p>
                    <button
                      onClick={() => {
                        setCurrentQuestion(0);
                        setSelectedAnswers([]);
                        setShowScore(false);
                      }}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Пройти тест заново
                    </button>
                  </div>
                </div>
              )}

              {/* Окно для вопросов */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Bot className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Задайте вопрос ИИ-учителю
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {suggestedQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setPromptInput(question)}
                        className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-lg text-sm transition-colors whitespace-normal text-left"
                      >
                        {question}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={promptInput}
                      onChange={(e) => setPromptInput(e.target.value)}
                      placeholder="Введите ваш вопрос..."
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px] resize-y"
                      style={{ minHeight: '80px' }}
                    />
                    <button
                      onClick={handlePromptSubmit}
                      disabled={!promptInput.trim() || tokens < 5}
                      className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 sm:mt-0"
                    >
                      Спросить (5 токенов)
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {currentLessonContent && (
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    stopSpeaking();
                    completeLesson('oop-introduction');
                    setCurrentLessonContent('');
                    navigate('/curriculum');
                  }}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
                >
                  <CheckCircle className="w-5 h-5" />
                  Завершить урок
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
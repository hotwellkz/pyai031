import { useEffect, useState } from 'react';
import { ArrowLeft, Brain, Bot, Code2, Globe, Rocket, Loader2, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAI } from '../hooks/useAI';
import { useAuthStore } from '../store/authStore';
import { TTSService } from '../lib/tts-service';

export default function Lesson() {
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
  const [currentPosition, setCurrentPosition] = useState(0);
  const { askAI } = useAI();
  const ttsService = TTSService.getInstance();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const currentLessonContent = useAuthStore((state) => state.currentLessonContent);
  const setCurrentLessonContent = useAuthStore((state) => state.setCurrentLessonContent);
  
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
  const completeLesson = useAuthStore((state) => state.completeLesson);
  const setTokens = useAuthStore((state) => state.setTokens);
  const navigate = useNavigate();
  
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

  useEffect(() => {
    // SEO-оптимизация
    document.title = 'Знакомство с Python | Первый урок курса Python';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Изучите основы Python: что такое Python, почему он популярен и где применяется. Первый урок курса с практическими примерами и интерактивными заданиями.');
    }
  }, []);

  useEffect(() => {
    const reminderInterval = setInterval(() => {
      setShowReminder(true);
      setTimeout(() => setShowReminder(false), 3000);
    }, 15000);

    return () => clearInterval(reminderInterval);
  }, []);

  const startLesson = async () => {
    setIsLoading(true);
    setError('');
    setError('');

    if (tokens <= 0) {
      alert('У вас закончились токены');
      setIsLoading(false);
      return;
    }

    const prompt = 'Расскажи подробно как будто ты преподаватель: Что такое Python?, Почему Python популярен?, Области применения Python';
    // Открываем чат перед отправкой промта
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
      console.error('Ошибка:', err);
      setError('Произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте позже.');
      setError('Произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте позже.');
    } finally {
      setIsLoading(false);
    }
  };

  const { ref: contentRef, inView: contentInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
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
              Урок 1: Знакомство с Python
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Начните свое путешествие в мир Python с изучения основ языка
              и его преимуществ
            </p>
          </div>
        </div>
      </section>

      {/* Lesson Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto mb-12">
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
                          window.speechSynthesis.pause();
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
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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
            {isLoading && (
              <div className="mt-4 text-center text-slate-600">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p>Пожалуйста, подождите. ИИ-учитель готовит материал урока... Это может занять несколько секунд.</p>
              </div>
            )}
            {error && (
              <div className="mt-4 bg-red-50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}
            </div>

            {/* Контент урока от ИИ */}
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
              className={`transform transition-all duration-1000 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Что такое Python */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Что такое Python?
                  </h2>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p>
                    Python — это высокоуровневый язык программирования общего назначения,
                    созданный Гвидо ван Россумом в 1991 году. Он отличается простым и
                    понятным синтаксисом, что делает его идеальным для начинающих
                    программистов.
                  </p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg my-6">
                    <pre className="text-sm"><code>print("Hello, World!")</code></pre>
                    <p className="text-sm text-slate-600 mt-2">
                      Это простейшая программа на Python, которая выводит текст на экран
                    </p>
                  </div>
                </div>
              </div>

              {/* Почему Python популярен */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Rocket className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Почему Python популярен?
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-slate-900">Преимущества Python:</h3>
                    <ul className="space-y-2">
                      <ListItem>Простой и понятный синтаксис</ListItem>
                      <ListItem>Большое сообщество разработчиков</ListItem>
                      <ListItem>Обширная библиотека модулей</ListItem>
                      <ListItem>Кроссплатформенность</ListItem>
                      <ListItem>Высокая производительность разработки</ListItem>
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-xl">
                    <h3 className="font-semibold text-slate-900 mb-4">
                      Рейтинг популярности:
                    </h3>
                    <div className="space-y-4">
                      <ProgressBar label="Веб-разработка" value={85} />
                      <ProgressBar label="Data Science" value={90} />
                      <ProgressBar label="Machine Learning" value={95} />
                      <ProgressBar label="Автоматизация" value={80} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Области применения */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Области применения Python
                  </h2>
                </div>
                
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <ApplicationCard
                    icon={<Code2 className="w-6 h-6" />}
                    title="Веб-разработка"
                    description="Создание сайтов и веб-приложений с использованием Django и Flask"
                  />
                  <ApplicationCard
                    icon={<Brain className="w-6 h-6" />}
                    title="Искусственный интеллект"
                    description="Машинное обучение и нейронные сети с TensorFlow и PyTorch"
                  />
                  <ApplicationCard
                    icon={<Globe className="w-6 h-6" />}
                    title="Data Science"
                    description="Анализ данных и визуализация с pandas и matplotlib"
                  />
                </div>
              </div>

              {/* Практическое задание */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  Практическое задание
                </h2>
                <p className="mb-6">
                  Создайте свою первую программу на Python, которая будет приветствовать
                  пользователя по имени.
                </p>
                <div className="bg-white/10 rounded-lg p-4">
                  <pre className="text-sm"><code>
                    name = input("Как вас зовут? ")<br/>
                    print(f"Привет, {'{name}'}! Добро пожаловать в мир Python!")
                  </code></pre>
                </div>
              </div>
            </div>
          </div>
          
          {/* Кнопка завершения урока */}
          {currentLessonContent && (
            <div className="text-center mt-12">
              <button
                onClick={() => {
                  stopSpeaking();
                  completeLesson('python-introduction');
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
      </section>

      <Footer />
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2">
      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
      <span className="text-slate-600">{children}</span>
    </li>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm text-slate-600 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-500 rounded-full transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function ApplicationCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-slate-50 p-6 rounded-xl">
      <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { ArrowLeft, Brain, Bot, Code2, Globe, Rocket, Loader2, CheckCircle, MonitorDown, Command, Cog } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAI } from '../hooks/useAI';
import { useAuthStore } from '../store/authStore';
import { TTSService } from '../lib/tts-service';

export default function PythonInstallation() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);
  const [showReminder, setShowReminder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isUsingPremiumVoice, setIsUsingPremiumVoice] = useState(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [isLoadingVoice, setIsLoadingVoice] = useState(false);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { askAI } = useAI();
  const ttsService = TTSService.getInstance();
  const currentLessonContent = useAuthStore((state) => state.currentLessonContent);
  const setCurrentLessonContent = useAuthStore((state) => state.setCurrentLessonContent);
  const tokens = useAuthStore((state) => state.tokens);
  const completeLesson = useAuthStore((state) => state.completeLesson);
  const setTokens = useAuthStore((state) => state.setTokens);
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

  const speak = async (text: string) => {
    try {
      setIsPremiumLoading(true);
      setIsLoadingVoice(true);
      setIsSpeaking(true);
      setIsUsingPremiumVoice(true);
      
      if (!text) {
        throw new Error('No text provided for speech synthesis');
      }

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
      console.error('Error synthesizing speech:', error instanceof Error ? error.message : 'Unknown error');
      setIsSpeaking(false);
      alert('Произошла ошибка при озвучивании текста. Пожалуйста, попробуйте позже.');
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
    document.title = 'Установка Python | Второй урок курса Python';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Научитесь устанавливать Python на разные операционные системы. Пошаговое руководство по установке Python на Windows, macOS и Linux.');
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
    if (tokens <= 0) {
      alert('У вас закончились токены');
      return;
    }

    setIsLoading(true);
    const prompt = 'Преподай урок "Установка Python", расскажи так как будто ты учитель на темы "Где скачать Python (сайт Python.org), Установка Python на Windows, macOS, Linux, Настройка переменных среды"';
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
        setTokens(tokens - 1);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Произошла ошибка при получении ответа от ИИ. Пожалуйста, попробуйте позже.');
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
              Урок 2: Установка Python
            </h1>
            <p className="text-xl text-gray-300">
              Научитесь устанавливать Python на разные операционные системы
              и настраивать окружение для разработки
            </p>
          </div>
        </div>
      </section>

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
                      disabled={tokens < 49 || isLoadingVoice}
                      onClick={() => {
                        if (tokens < 49) {
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
                          setTokens(tokens - 49);
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
                          Премиум озвучка (49 токенов)
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

            {/* Блоки с информацией об установке */}
            <div 
              ref={contentRef}
              className={`transform transition-all duration-1000 ${
                contentInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
            >
              {/* Где скачать Python */}
              <div className="bg-white rounded-xl p-8 shadow-sm mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Где скачать Python?
                  </h2>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p>
                    Python можно скачать с официального сайта Python.org. Это единственный
                    надёжный источник для загрузки интерпретатора Python.
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-lg my-6">
                    <h3 className="text-lg font-semibold mb-4">Шаги для загрузки:</h3>
                    <ol className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">1</span>
                        <span>Перейдите на <a href="https://www.python.org/downloads/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">www.python.org/downloads</a></span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">2</span>
                        <span>Нажмите на кнопку "Download Python X.X.X"</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">3</span>
                        <span>Выберите версию, подходящую для вашей операционной системы</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Установка на разные ОС */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                    <MonitorDown className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Windows</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Запустите установщик от имени администратора
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Отметьте "Add Python to PATH"
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Выберите "Install Now"
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                    <Command className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">macOS</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Скачайте .pkg установщик
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Следуйте инструкциям установщика
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Python будет доступен в Terminal
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white mb-4">
                    <Command className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-4">Linux</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Используйте пакетный менеджер:
                    </li>
                    <li className="flex items-start gap-2">
                      <code className="bg-slate-100 px-2 py-1 rounded text-sm">
                        sudo apt install python3
                      </code>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      Проверьте установку: python3 --version
                    </li>
                  </ul>
                </div>
              </div>

              {/* Настройка переменных среды */}
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Cog className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Настройка переменных среды
                  </h2>
                </div>
                
                <div className="prose prose-slate max-w-none">
                  <p>
                    Правильная настройка переменных среды позволит запускать Python
                    из любой директории в командной строке.
                  </p>
                  
                  <div className="bg-slate-50 p-6 rounded-lg my-6">
                    <h3 className="text-lg font-semibold mb-4">Windows:</h3>
                    <ol className="space-y-4">
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">1</span>
                        <div>
                          <p className="font-medium">Откройте Свойства системы</p>
                          <p className="text-sm text-slate-600">Win + R → sysdm.cpl</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">2</span>
                        <div>
                          <p className="font-medium">Перейдите в "Дополнительно" → "Переменные среды"</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">3</span>
                        <div>
                          <p className="font-medium">Найдите переменную PATH</p>
                          <p className="text-sm text-slate-600">В системных переменных</p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="w-6 h-6 bg-blue-500 rounded-full text-white flex items-center justify-center flex-shrink-0">4</span>
                        <div>
                          <p className="font-medium">Добавьте путь к Python</p>
                          <p className="text-sm text-slate-600">Обычно C:\Python3X\Scripts\ и C:\Python3X\</p>
                        </div>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-lg my-6">
                    <h3 className="text-lg font-semibold mb-4">macOS и Linux:</h3>
                    <p>
                      Обычно не требует дополнительной настройки. Python автоматически
                      добавляется в PATH при установке.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {currentLessonContent && (
              <div className="text-center mt-12">
                <button
                  onClick={() => {
                    stopSpeaking();
                    completeLesson('python-installation');
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
import { useEffect } from 'react';
import { ArrowLeft, BookOpen, Code2, Database, Globe, GitBranch, Laptop, Library, TestTube, Trophy, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuthStore } from '../store/authStore';

export default function Curriculum() {
  const completedLessons = useAuthStore((state) => state.completedLessons);
  useEffect(() => {
    document.title = 'Программа курса Python | PyAI Teacher';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Программа курса Python
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Полный путь от новичка до профессионального Python-разработчика
            </p>
            <a
              href="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </a>
          </div>
        </div>
      </section>

      {/* Curriculum Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {blocks.map((block, index) => (
              <CurriculumBlock
                key={index}
                number={index + 1}
                title={block.title}
                icon={block.icon}
                lessons={block.lessons}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

interface Lesson {
  title: string;
  topics?: string[];
}

interface Block {
  title: string;
  icon: React.ReactNode;
  lessons: Lesson[];
}

const blocks: Block[] = [
  {
    title: 'Введение в программирование и установка Python',
    icon: <Laptop className="w-6 h-6" />,
    lessons: [
      {
        title: 'Знакомство с Python',
        topics: [
          'Что такое Python?',
          'Почему Python популярен?',
          'Области применения Python'
        ]
      },
      {
        title: 'Установка Python',
        topics: [
          'Где скачать Python (сайт Python.org)',
          'Установка Python на Windows, macOS, Linux',
          'Настройка переменных среды'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Основы программирования на Python',
    icon: <Code2 className="w-6 h-6" />,
    lessons: [
      {
        title: 'Переменные и типы данных',
        topics: [
          'Типы данных в Python',
          'Создание и вывод переменных',
          'Правила именования переменных',
          'Практические примеры'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Объектно-ориентированное программирование (ООП)',
    icon: <BookOpen className="w-6 h-6" />,
    lessons: [
      {
        title: 'Основы ООП',
        topics: [
          'Что такое классы и объекты?',
          'Атрибуты и методы класса'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Работа с модулями и файлами',
    icon: <Library className="w-6 h-6" />,
    lessons: [
      {
        title: 'Модули и пакеты',
        topics: [
          'Импорт встроенных модулей и создание своих'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Работа с базами данных',
    icon: <Database className="w-6 h-6" />,
    lessons: [
      {
        title: 'SQLite и SQL',
        topics: [
          'Подключение базы данных с sqlite3',
          'Создание и выполнение запросов'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Основы веб-разработки на Python',
    icon: <Globe className="w-6 h-6" />,
    lessons: [
      {
        title: 'Введение во Flask',
        topics: [
          'Установка и настройка Flask',
          'Создание простого веб-приложения'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Тестирование кода',
    icon: <TestTube className="w-6 h-6" />,
    lessons: [
      {
        title: 'Тесты с unittest',
        topics: [
          'Написание unit-тестов для функций и классов'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Продвинутые темы',
    icon: <GitBranch className="w-6 h-6" />,
    lessons: [
      {
        title: 'Асинхронное программирование',
        topics: [
          'Основы asyncio и использование await'
        ]
      },
      // ... остальные уроки блока
    ]
  },
  {
    title: 'Финальные проекты',
    icon: <Trophy className="w-6 h-6" />,
    lessons: [
      {
        title: 'Проекты',
        topics: [
          'Консольное приложение (To-Do List)',
          'Веб-приложение с Flask',
          'Парсер данных с BeautifulSoup',
          'Анализ данных с pandas и matplotlib'
        ]
      }
    ]
  }
];

function CurriculumBlock({ 
  number, 
  title, 
  icon,
  lessons 
}: { 
  number: number;
  title: string;
  icon: React.ReactNode;
  lessons: Lesson[];
}) {
  const completedLessons = useAuthStore((state) => state.completedLessons);
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center text-white">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          Блок {number}: {title}
        </h2>
      </div>
      
      <div className="space-y-6 pl-16">
        {lessons.map((lesson, index) => (
          <div 
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            style={{
              borderLeft: undefined
            }}
          >
            {lesson.title === 'Знакомство с Python' ? (
              <Link
                to="/lesson/python-introduction"
                className={`block text-lg font-semibold mb-4 hover:text-blue-600 transition-colors ${
                  completedLessons.includes('python-introduction')
                    ? 'text-green-600'
                    : 'text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  Урок {index + 1}: {lesson.title}
                  {completedLessons.includes('python-introduction') && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </Link>
            ) : lesson.title === 'Переменные и типы данных' ? (
              <Link
                to="/lesson/variables-introduction"
                className={`block text-lg font-semibold mb-4 hover:text-blue-600 transition-colors ${
                  completedLessons.includes('variables-introduction')
                    ? 'text-green-600'
                    : 'text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  Урок {index + 1}: {lesson.title}
                  {completedLessons.includes('variables-introduction') && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </Link>
            ) : lesson.title === 'Основы ООП' ? (
              <Link
                to="/lesson/oop-introduction"
                className={`block text-lg font-semibold mb-4 hover:text-blue-600 transition-colors ${
                  completedLessons.includes('oop-introduction')
                    ? 'text-green-600'
                    : 'text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2">
                  Урок {index + 1}: {lesson.title}
                  {completedLessons.includes('oop-introduction') && (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  )}
                </div>
              </Link>
            ) : (
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Урок {index + 1}: {lesson.title}
              </h3>
            )}
            {lesson.topics && (
              <ul className="space-y-2">
                {lesson.topics.map((topic, topicIndex) => (
                  <li 
                    key={topicIndex}
                    className="flex items-start gap-2 text-slate-600"
                  >
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
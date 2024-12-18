import { Brain, Github } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Логотип и описание */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <span className="text-white font-bold text-xl">PyAI Teacher</span>
            </Link>
            <p className="text-sm text-gray-400">
              Персональный ИИ-учитель для изучения Python. Адаптивное обучение,
              мгновенная обратная связь и интерактивные уроки.
            </p>
          </div>

          {/* Навигация */}
          <div className="md:col-span-2">
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                <Link to="/curriculum">Программа курса</Link>
              </li>
              <li className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                <Link to="/pricing">Тарифы</Link>
              </li>
            </ul>
          </div>

          {/* Социальные сети */}
          <div>
            <h3 className="text-white font-semibold mb-4">Мы в соцсетях</h3>
            <div className="flex space-x-4">
              <SocialLink href="https://github.com" icon={<Github />} />
              <SocialLink href="https://t.me/pyaiteacher" icon={<TelegramIcon />} />
              <SocialLink href="https://vk.com/pyaiteacher" icon={<VKIcon />} />
            </div>
          </div>
        </div>

        {/* Нижняя часть футера */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} PyAI Teacher. Все права защищены.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/privacy"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Политика конфиденциальности
              </Link>
              <Link
                to="/terms"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Условия использования
              </Link>
              <Link
                to="/offer"
                className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
              >
                Публичная оферта
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-sm text-gray-400 hover:text-white transition-colors duration-200"
    >
      {children}
    </a>
  );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-blue-500 text-gray-400 hover:text-white transition-all duration-200"
    >
      {icon}
    </a>
  );
}

function TelegramIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21.633 3.373L2.367 10.727c-1.3.5-1.3 2.046 0 2.546l19.266 7.354c1.3.5 2.6-.5 2.6-1.773V5.146c0-1.273-1.3-2.273-2.6-1.773z" />
      <path d="M9.033 13.273L4.7 17.606c-.433.433-1.3.433-1.733 0L1.7 16.34c-.433-.433-.433-1.3 0-1.733l4.333-4.333" />
    </svg>
  );
}

function VKIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10S2 17.52 2 12z" />
      <path d="M7 8h10" />
      <path d="M7 12h10" />
      <path d="M7 16h10" />
    </svg>
  );
}
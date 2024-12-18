import { Bot, BookOpen, Brain, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  const scrollToFAQ = () => {
    const faqSection = document.getElementById('faq');
    if (faqSection) {
      faqSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Изучайте Python с Персональным{' '}
            <span className="text-blue-400">ИИ-учителем</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Индивидуальный подход, мгновенная обратная связь и интерактивные уроки
            для эффективного обучения программированию
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              to="/curriculum"
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
            >
              Начать бесплатно
            </Link>
            <button
              onClick={scrollToFAQ}
              className="bg-white hover:bg-gray-100 text-slate-900 px-8 py-3 rounded-lg font-medium transition-colors duration-200 text-center"
            >
              Узнать больше
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            <Feature icon={<Brain />} text="Адаптивное обучение" />
            <Feature icon={<Code />} text="Практические задания" />
            <Feature icon={<BookOpen />} text="Полная программа" />
            <Feature icon={<Bot />} text="24/7 поддержка" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
      <div className="text-blue-400 mb-2">{icon}</div>
      <p className="text-sm text-gray-300 text-center">{text}</p>
    </div>
  );
}
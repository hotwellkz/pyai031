import { ArrowRight, Brain, Code2, Sparkles } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export default function StartFree() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-slate-900 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`max-w-5xl mx-auto text-center transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full text-blue-200 mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Бесплатный доступ</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Начни изучать Python прямо сейчас
          </h2>
          
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Получи доступ к первым урокам и персональному ИИ-учителю совершенно бесплатно
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              to="/curriculum"
              className="group bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 w-full sm:w-auto"
            >
              <span>Начать бесплатно</span>
              <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/curriculum" className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 w-full sm:w-auto">
              Посмотреть программу
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature 
              icon={<Brain className="w-6 h-6" />}
              title="ИИ-учитель 24/7"
              description="Персональный помощник, который всегда на связи"
            />
            <Feature 
              icon={<Code2 className="w-6 h-6" />}
              title="Интерактивные уроки"
              description="Практика программирования прямо в браузере"
            />
            <Feature 
              icon={<Sparkles className="w-6 h-6" />}
              title="Мгновенная проверка"
              description="Автоматическая проверка и анализ вашего кода"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
      <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-200">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-blue-100">{description}</p>
    </div>
  );
}
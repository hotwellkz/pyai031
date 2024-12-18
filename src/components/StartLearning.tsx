import { ArrowRight, BookOpen, CheckCircle, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

export default function StartLearning() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`max-w-6xl mx-auto transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Пройти обучение
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Начните свой путь в программировании прямо сейчас с нашим ИИ-учителем.
                Персональный подход и поддержка на каждом этапе обучения.
              </p>
              
              <div className="space-y-4 mb-8">
                <Benefit 
                  icon={<Users className="w-5 h-5 text-blue-500" />}
                  text="Более 10,000 успешных выпускников"
                />
                <Benefit 
                  icon={<BookOpen className="w-5 h-5 text-blue-500" />}
                  text="Современная программа обучения"
                />
                <Benefit 
                  icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
                  text="Сертификат по окончании курса"
                />
              </div>

              <Link 
                to="/curriculum"
                className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 flex items-center space-x-2 justify-center"
              >
                <span>Начать обучение</span>
                <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=2128&ixlib=rb-4.0.3"
                  alt="Программирование на Python"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-lg shadow-xl p-4 max-w-xs">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Sparkle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">Быстрый старт</h4>
                    <p className="text-sm text-slate-600">
                      Начните писать код уже через 5 минут после регистрации
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Benefit({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-blue-100 rounded-lg">{icon}</div>
      <span className="text-slate-700">{text}</span>
    </div>
  );
}

function Sparkle({ className }: { className?: string }) {
  return (
    <svg 
      className={className}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z" />
    </svg>
  );
}
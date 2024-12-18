import { Sparkles, Star, Zap } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

export default function NewEraLearning() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Новая эра обучения с{' '}
            <span className="text-blue-400">искусственным интеллектом</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card
              icon={<Sparkles className="w-8 h-8 text-blue-400" />}
              title="Персонализация"
              description="ИИ адаптирует материал под ваш уровень и стиль обучения"
              delay="delay-0"
            />
            <Card
              icon={<Zap className="w-8 h-8 text-blue-400" />}
              title="Скорость"
              description="Изучайте Python в 3 раза быстрее с помощью ИИ-учителя"
              delay="delay-150"
            />
            <Card
              icon={<Star className="w-8 h-8 text-blue-400" />}
              title="Эффективность"
              description="95% студентов успешно завершают курс и находят работу"
              delay="delay-300"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Card({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
}) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`bg-white/10 backdrop-blur-sm rounded-xl p-6 transform transition-all duration-700 ${delay} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
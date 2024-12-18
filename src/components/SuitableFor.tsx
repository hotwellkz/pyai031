import { BookOpen, Code2, GraduationCap, Lightbulb, Rocket, Users } from 'lucide-react';
import { useInView } from 'react-intersection-observer';

const categories = [
  {
    icon: <Users className="w-8 h-8 text-blue-500" />,
    title: 'Начинающие',
    description: 'Идеально подходит для тех, кто никогда не программировал'
  },
  {
    icon: <Code2 className="w-8 h-8 text-blue-500" />,
    title: 'Программисты',
    description: 'Для тех, кто хочет освоить Python как второй язык'
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-blue-500" />,
    title: 'Студенты',
    description: 'Дополнительное образование к основной специальности'
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-500" />,
    title: 'Специалисты',
    description: 'Для перехода в сферу IT из других областей'
  },
  {
    icon: <BookOpen className="w-8 h-8 text-blue-500" />,
    title: 'Преподаватели',
    description: 'Для внедрения современных методик обучения'
  },
  {
    icon: <Lightbulb className="w-8 h-8 text-blue-500" />,
    title: 'Предприниматели',
    description: 'Для автоматизации и развития своего бизнеса'
  }
];

export default function SuitableFor() {
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
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
            Кому подходит обучение
          </h2>
          <p className="text-lg text-slate-600 text-center mb-12 max-w-3xl mx-auto">
            Наш курс разработан для людей с разным уровнем подготовки и целями
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <CategoryCard
                key={index}
                {...category}
                delay={`delay-${index * 100}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ 
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
      className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform ${delay} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <div className="bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
import { CheckCircle2, Code2, Cpu, GitBranch, MessageSquare, Rocket, Shield, Zap } from 'lucide-react';

export default function Features() {
  return (
    <section id="features" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Почему стоит учиться с ИИ-учителем?
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Наш ИИ-учитель предоставляет персонализированный опыт обучения,
            адаптируясь под ваш темп и стиль изучения Python
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Cpu className="w-6 h-6 text-blue-500" />}
            title="Умный ИИ-ассистент"
            description="Мгновенные ответы на вопросы и персонализированная помощь 24/7"
          />
          <FeatureCard
            icon={<Code2 className="w-6 h-6 text-blue-500" />}
            title="Интерактивный код"
            description="Практикуйтесь прямо в браузере с мгновенной обратной связью"
          />
          <FeatureCard
            icon={<Zap className="w-6 h-6 text-blue-500" />}
            title="Адаптивное обучение"
            description="Программа подстраивается под ваш уровень и скорость обучения"
          />
          <FeatureCard
            icon={<CheckCircle2 className="w-6 h-6 text-blue-500" />}
            title="Проверка кода"
            description="Автоматическая проверка и подробный анализ вашего кода"
          />
          <FeatureCard
            icon={<GitBranch className="w-6 h-6 text-blue-500" />}
            title="Проекты и задачи"
            description="Реальные проекты для практического применения знаний"
          />
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-blue-500" />}
            title="Обратная связь"
            description="Детальные объяснения и рекомендации по улучшению кода"
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-blue-500" />}
            title="Безопасность"
            description="Защищенная среда для обучения и выполнения заданий"
          />
          <FeatureCard
            icon={<Rocket className="w-6 h-6 text-blue-500" />}
            title="Быстрый прогресс"
            description="Эффективная методика для быстрого освоения Python"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600">{description}</p>
    </div>
  );
}
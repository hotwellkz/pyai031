import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

const faqs = [
  {
    question: 'Нужен ли опыт программирования для начала обучения?',
    answer: 'Нет, наш курс подходит для абсолютных новичков. ИИ-учитель адаптирует материал под ваш уровень.'
  },
  {
    question: 'Сколько времени занимает обучение?',
    answer: 'В среднем студенты осваивают базовый курс за 3-4 месяца при занятиях 1-2 часа в день.'
  },
  {
    question: 'Как происходит обучение с ИИ-учителем?',
    answer: 'ИИ анализирует ваш прогресс, адаптирует материал и предоставляет персональные рекомендации.'
  },
  {
    question: 'Есть ли практические задания?',
    answer: 'Да, курс включает множество практических заданий и реальных проектов для портфолио.'
  },
  {
    question: 'Какие перспективы после обучения?',
    answer: 'Выпускники курса успешно находят работу Python-разработчиками или продолжают обучение.'
  },
  {
    question: 'Предоставляется ли сертификат?',
    answer: 'Да, по окончании курса вы получите сертификат о прохождении обучения.'
  },
  {
    question: 'Есть ли поддержка во время обучения?',
    answer: 'ИИ-учитель доступен 24/7, плюс есть поддержка от команды курса.'
  },
  {
    question: 'Можно ли учиться с мобильного?',
    answer: 'Да, платформа полностью адаптирована для обучения с любых устройств.'
  },
  {
    question: 'Как происходит оплата?',
    answer: 'Доступна помесячная оплата или единовременный платеж со скидкой.'
  },
  {
    question: 'Есть ли гарантия возврата денег?',
    answer: 'Да, в течение первых 14 дней действует гарантия возврата средств.'
  }
];

export default function FAQ() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="faq" className="py-20 bg-white scroll-mt-20">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`max-w-3xl mx-auto transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-4">
            Топ 10 вопросов
          </h2>
          <p className="text-lg text-slate-600 text-center mb-12">
            Ответы на самые популярные вопросы о нашем курсе
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                question={faq.question} 
                answer={faq.answer}
                delay={`delay-${index * 100}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ 
  question, 
  answer,
  delay
}: { 
  question: string; 
  answer: string;
  delay: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div
      ref={ref}
      className={`transform transition-all duration-700 ${delay} ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors duration-200"
      >
        <span className="font-medium text-left text-slate-900">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-600 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 text-slate-600 bg-slate-50 rounded-b-lg -mt-2">
          {answer}
        </div>
      )}
    </div>
  );
}
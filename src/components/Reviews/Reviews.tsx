import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import ReviewCard from './ReviewCard';
import ReviewModal from './ReviewModal';

const reviews = [
  {
    name: 'Александр Петров',
    date: '15.03.2024',
    rating: 5,
    text: 'Отличный курс! ИИ-учитель действительно помогает освоить Python намного быстрее.',
    role: 'Начинающий разработчик'
  },
  {
    name: 'Мария Иванова',
    date: '12.03.2024',
    rating: 5,
    text: 'Удобная платформа, понятные объяснения. Очень довольна результатами обучения.',
    role: 'Студентка'
  },
  {
    name: 'Дмитрий Сидоров',
    date: '10.03.2024',
    rating: 4,
    text: 'Хороший баланс теории и практики. ИИ дает полезные рекомендации.',
    role: 'Веб-разработчик'
  },
  {
    name: 'Елена Козлова',
    date: '05.03.2024',
    rating: 5,
    text: 'Прекрасная возможность изучить Python с нуля. Рекомендую всем начинающим!',
    role: 'Аналитик данных'
  }
];

export default function Reviews() {
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isDirectorModalOpen, setDirectorModalOpen] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'YOUR-ACCESS-KEY', // Замените на ваш ключ
          subject: data.type === 'review' ? 'Новый отзыв' : 'Сообщение директору',
          from_name: data.name,
          from_email: data.email,
          message: data.message,
          to_email: 'a777mmm@mail.ru',
        }),
      });

      if (response.ok) {
        alert('Сообщение успешно отправлено!');
      } else {
        throw new Error('Ошибка при отправке');
      }
    } catch (error) {
      alert('Произошла ошибка при отправке сообщения');
    }
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div 
          ref={ref}
          className={`text-center mb-12 transform transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Отзывы наших студентов
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
            Узнайте, что говорят студенты о нашем курсе и ИИ-учителе
          </p>
          
          <div className="flex gap-4 justify-center mb-12">
            <button
              onClick={() => setReviewModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Оставить отзыв
            </button>
            <button
              onClick={() => setDirectorModalOpen(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-900 px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Написать директору
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
          
          <div className="flex overflow-hidden touch-none">
            <div className="flex animate-scroll md:animate-scroll-slow">
              {[...reviews, ...reviews].map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        type="review"
        onSubmit={handleSubmit}
      />
      
      <ReviewModal
        isOpen={isDirectorModalOpen}
        onClose={() => setDirectorModalOpen(false)}
        type="director"
        onSubmit={handleSubmit}
      />
    </section>
  );
}
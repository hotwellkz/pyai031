import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    document.title = 'Условия использования | PyAI Teacher';
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Link
              to="/"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Условия использования
            </h1>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-slate">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2>1. Принятие условий</h2>
              <p>
                Используя платформу PyAI Teacher, вы принимаете настоящие условия
                использования. Если вы не согласны с каким-либо пунктом, пожалуйста,
                прекратите использование платформы.
              </p>

              <h2>2. Регистрация</h2>
              <p>
                Для использования платформы необходимо создать учетную запись.
                Вы обязуетесь предоставить достоверную информацию при регистрации
                и поддерживать её актуальность.
              </p>

              <h2>3. Оплата и возврат средств</h2>
              <ul>
                <li>Все платежи обрабатываются безопасным способом</li>
                <li>Возврат средств возможен в течение 14 дней после покупки</li>
                <li>Неиспользованные токены не подлежат возврату</li>
              </ul>

              <h2>4. Правила использования</h2>
              <p>При использовании платформы запрещается:</p>
              <ul>
                <li>Нарушать права интеллектуальной собственности</li>
                <li>Распространять вредоносный код</li>
                <li>Создавать множественные учетные записи</li>
                <li>Передавать доступ к учетной записи третьим лицам</li>
              </ul>

              <h2>5. Интеллектуальная собственность</h2>
              <p>
                Весь контент на платформе является интеллектуальной собственностью
                PyAI Teacher или используется с соответствующего разрешения.
              </p>

              <h2>6. Ограничение ответственности</h2>
              <p>
                PyAI Teacher не несет ответственности за:
              </p>
              <ul>
                <li>Перерывы в работе платформы</li>
                <li>Потерю данных</li>
                <li>Косвенные убытки</li>
              </ul>

              <h2>7. Изменение условий</h2>
              <p>
                Мы оставляем за собой право изменять настоящие условия использования.
                Продолжая использовать платформу после внесения изменений, вы принимаете
                новые условия.
              </p>

              <h2>8. Применимое право</h2>
              <p>
                Настоящие условия регулируются и толкуются в соответствии с
                законодательством Республики Казахстан.
              </p>

              <h2>9. Контакты</h2>
              <p>
                По всем вопросам, связанным с условиями использования, обращайтесь:
                support@pyaiteacher.com
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
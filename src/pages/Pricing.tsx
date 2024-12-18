import { Check } from 'lucide-react';
import PaymentButton from '../components/PaymentButton';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

export default function Pricing() {
  useEffect(() => {
    document.title = 'Тарифы | PyAI Teacher';
  }, []);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="pt-32 pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Тарифные планы
            </h1>
            <p className="text-xl text-gray-300">
              Выберите подходящий тарифный план и начните обучение уже сегодня
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div 
            ref={ref}
            className={`grid md:grid-cols-3 gap-8 max-w-6xl mx-auto transform transition-all duration-1000 relative ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Декоративные элементы */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
            
            {/* Базовый план */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 border border-blue-100 hover:border-blue-300 hover:shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                AI Старт
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">3,250</span>
                <span className="text-gray-600">₸</span>
              </div>
              <p className="text-gray-600 mb-6">
                100 токенов - Достаточно для знакомства с платформой и изучения основ Python
              </p>
              <div className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-6 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <PaymentButton
                  amount={3250}
                  tokens={100}
                  description="AI Старт - 100 токенов"
                  className="w-full h-full"
                />
              </div>
              <ul className="space-y-3">
                <ListItem>100 токенов</ListItem>
              </ul>
            </div>

            {/* Стандартный план */}
            <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-2xl shadow-xl p-8 transform hover:scale-110 transition-all duration-300 relative group border border-blue-500/30">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-medium shadow-lg animate-pulse">
                Популярный выбор
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
              <h3 className="text-xl font-semibold text-blue-400 mb-2">
                AI Прорыв
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">5,500</span>
                <span className="text-gray-300">₸</span>
              </div>
              <p className="text-gray-300 mb-6">
                300 токенов - Оптимальный набор для полноценного изучения Python с помощью ИИ
              </p>
              <div className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-6 relative overflow-hidden group">
                <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <PaymentButton
                  amount={5500}
                  tokens={300}
                  description="AI Прорыв - 300 токенов"
                  className="w-full h-full"
                />
              </div>
              <ul className="space-y-3 text-gray-300">
                <ListItem>300 токенов</ListItem>
              </ul>
            </div>

            {/* Премиум план */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 hover:transform hover:scale-105 transition-all duration-300 border border-purple-100 hover:border-purple-300 hover:shadow-xl relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <h3 className="text-xl font-semibold text-purple-600 mb-2">
                AI Эксперт
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold">12,250</span>
                <span className="text-gray-600">₸</span>
              </div>
              <p className="text-gray-600 mb-6">
                1000 токенов - Максимальный набор для полного курса и будущих обновлений
              </p>
              <div className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg mb-6 relative overflow-hidden group">
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <PaymentButton
                  amount={12250}
                  tokens={1000}
                  description="AI Эксперт - 1000 токенов"
                  className="w-full h-full"
                />
              </div>
              <ul className="space-y-3">
                <ListItem>1000 токенов</ListItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
      <span>{children}</span>
    </li>
  );
}
import { useState } from 'react';
import { PaymentService } from '../lib/cloudpayments';
import { useAuthStore } from '../store/authStore';
import { Loader2 } from 'lucide-react';

interface PaymentButtonProps {
  amount: number;
  tokens: number;
  description: string;
  className?: string;
}

export default function PaymentButton({ amount, tokens, description, className }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setTokens = useAuthStore((state) => state.setTokens);
  const currentTokens = useAuthStore((state) => state.tokens);

  const handlePayment = async () => {
    if (!user) {
      alert('Пожалуйста, войдите в систему для совершения покупки');
      return;
    }

    setIsLoading(true);
    const paymentService = PaymentService.getInstance();

    try {
      const result = await paymentService.pay({
        amount,
        currency: 'KZT',
        description: `${description} | ${user.email}`,
        accountId: user.uid,
        email: user.email || undefined
      });

      if (result.status === 'Completed') {
        // Обновляем количество токенов
        setTokens(currentTokens + tokens);
        // Показываем уведомление об успешной оплате
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
        notification.textContent = 'Оплата прошла успешно! Токены добавлены на ваш счет.';
        document.body.appendChild(notification);
        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      // Показываем уведомление об ошибке
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in';
      notification.textContent = 'Произошла ошибка при оплате. Пожалуйста, попробуйте позже.';
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      onClick={handlePayment}
      role="button"
      role="button"
      aria-disabled={isLoading}
      className={`${className} disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Обработка...
        </div>
      ) : (
        'Начать обучение'
      )}
    </div>
  );
}
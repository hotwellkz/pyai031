import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900 mb-4">
                Требуется подтверждение email
              </h1>
              <p className="text-slate-600 mb-6">
                Для доступа к урокам необходимо подтвердить ваш email адрес. 
                Пожалуйста, проверьте вашу почту и перейдите по ссылке в письме для подтверждения.
              </p>
              <button
                onClick={async () => {
                  try {
                    await user.reload();
                    window.location.reload();
                  } catch (error) {
                    console.error('Ошибка при обновлении статуса:', error);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
              >
                Обновить статус
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
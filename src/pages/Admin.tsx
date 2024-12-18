import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Loader2, Trash2, Edit2, Save, X } from 'lucide-react';

interface User {
  id: string;
  email: string;
  tokens: number;
  isEditing?: boolean;
  newTokens?: number;
}

export default function Admin() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Админ панель | PyAI Teacher';
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '1888') {
      setIsAuthorized(true);
      fetchUsers();
    } else {
      setError('Неверный пароль');
    }
  };

  const fetchUsers = async () => {
    try {
      const usersCollection = collection(db, 'users');
      try {
        const snapshot = await getDocs(usersCollection);
        const usersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          email: doc.data().email || 'Нет email',
          tokens: doc.data().tokens || 0
        })) as User[];
        setUsers(usersData);
        setError('');
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('permission-denied')) {
            setError('Нет прав доступа к данным пользователей');
          } else {
            setError(`Ошибка при загрузке пользователей: ${err.message}`);
          }
        }
        setUsers([]);
      }
    } catch (err) {
      console.error('Ошибка при загрузке пользователей:', err);
      setError('Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    setError('');

    try {
      // Удаляем документ пользователя из Firestore
      await deleteDoc(doc(db, 'users', userId));
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      if (err instanceof Error) {
        setError(`Ошибка при удалении пользователя: ${err.message}`);
      } else {
        setError('Ошибка при удалении пользователя');
      }
    }
  };

  const startEditingTokens = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, isEditing: true, newTokens: user.tokens };
      }
      return user;
    }));
  };

  const cancelEditingTokens = (userId: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        return { ...user, isEditing: false, newTokens: undefined };
      }
      return user;
    }));
  };

  const saveTokens = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user || user.newTokens === undefined) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        tokens: user.newTokens
      });

      setUsers(users.map(u => {
        if (u.id === userId) {
          return { ...u, tokens: u.newTokens, isEditing: false, newTokens: undefined };
        }
        return u;
      }));
    } catch (err) {
      console.error('Ошибка при обновлении токенов:', err);
      setError('Ошибка при обновлении токенов');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="bg-white rounded-xl p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-slate-900 mb-6">
                  Вход в админ панель
                </h1>
                {error && (
                  <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                <form onSubmit={handleAuth} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    Войти
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
              Управление пользователями
            </h1>

            {error && (
              <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-4">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Email</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-slate-600">Токены</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-slate-600">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-900">
                            {user.isEditing ? (
                              <input
                                type="number"
                                value={user.newTokens}
                                onChange={(e) => setUsers(users.map(u => {
                                  if (u.id === user.id) {
                                    return { ...u, newTokens: parseInt(e.target.value) };
                                  }
                                  return u;
                                }))}
                                className="w-24 px-2 py-1 border border-slate-300 rounded"
                              />
                            ) : (
                              user.tokens
                            )}
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {user.isEditing ? (
                              <>
                                <button
                                  onClick={() => saveTokens(user.id)}
                                  className="text-green-600 hover:text-green-700"
                                >
                                  <Save className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => cancelEditingTokens(user.id)}
                                  className="text-slate-600 hover:text-slate-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => startEditingTokens(user.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
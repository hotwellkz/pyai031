export { auth, db, googleProvider } from './config';
export { saveUserProgress, getUserProgress } from './progress';
export { saveUserTokens, getUserTokens } from './tokens';

// Инициализация слушателей состояния соединения
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from './config';

// Мониторинг состояния соединения
const connectionRef = doc(db, '.info/connected');
onSnapshot(connectionRef, (snap) => {
  if (snap.exists()) {
    console.log('Connected to Firestore');
  } else {
    console.log('Disconnected from Firestore');
  }
});
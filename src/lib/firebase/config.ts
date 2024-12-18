import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDZGcFN0qo3ImZoOmNKpIk6tXNOuqZdWWQ",
  authDomain: "phyton-a56f5.firebaseapp.com",
  projectId: "phyton-a56f5",
  storageBucket: "phyton-a56f5.appspot.com",
  messagingSenderId: "742070544602",
  appId: "1:742070544602:web:e7d56ef0315279ab5d1de3",
  experimentalForceLongPolling: true,
  useFetchStreams: false
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Экспорт сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Настройка Google Provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Включаем постоянное соединение для Firestore
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      console.log('The current browser does not support persistence.');
    }
  });
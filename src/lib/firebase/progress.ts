import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const saveUserProgress = async (userId: string, completedLessons: string[]) => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        
        await setDoc(userRef, {
          ...currentData,
          completedLessons: completedLessons,
          updatedAt: new Date().toISOString()
        });
        return true;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return false;
  } catch (error) {
    console.error('Ошибка сохранения прогресса:', error);
    return false;
  }
};

export const getUserProgress = async (userId: string): Promise<string[]> => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.completedLessons || [];
        }
        await setDoc(userRef, { completedLessons: [] }, { merge: true });
        return [];
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    return [];
  } catch (error) {
    console.error('Ошибка получения прогресса:', error);
    return [];
  }
};
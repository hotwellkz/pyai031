import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './config';

export const saveUserTokens = async (userId: string, tokens: number) => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        const currentData = docSnap.exists() ? docSnap.data() : {};
        
        await setDoc(userRef, {
          ...currentData,
          tokens: tokens,
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
    console.error('Ошибка сохранения токенов:', error);
    return false;
  }
};

export const getUserTokens = async (userId: string): Promise<number> => {
  try {
    const userRef = doc(db, 'users', userId);
    let retries = 3;
    while (retries > 0) {
      try {
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          return data.tokens || 0;
        }
        return 0;
      } catch (error) {
        retries--;
        if (retries === 0) throw error;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    return 0;
  } catch (error) {
    console.error('Ошибка получения токенов:', error);
    return 0;
  }
};
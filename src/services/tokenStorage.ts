import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SessionPayload } from '../types';

const SESSION_KEY = '@laundry_session';

export const tokenStorage = {
  async setSession(session: SessionPayload) {
    await AsyncStorage.setItem(
      SESSION_KEY,
      JSON.stringify(session),
    );
  },

  async getSession(): Promise<SessionPayload | null> {
    const data = await AsyncStorage.getItem(
      SESSION_KEY,
    );

    if (!data) {
      return null;
    }

    return JSON.parse(data) as SessionPayload;
  },

  async clear() {
    await AsyncStorage.removeItem(
      SESSION_KEY,
    );
  },
};
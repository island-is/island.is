import create, { State } from 'zustand/vanilla';
import createUse from 'zustand';
import { AuthorizeResult } from 'react-native-app-auth';
import Keychain from 'react-native-keychain';

interface AuthStore extends State {
  isAuthenticated: boolean;
  authorizeResult: AuthorizeResult | undefined;
  setAuthorizeResult: (value: AuthorizeResult) => void;
}

export const authStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  authorizeResult: undefined,
  setAuthorizeResult: (authorizeResult: AuthorizeResult) => set(state => ({ ...state, authorizeResult }))
}));

export const useAuthStore = createUse(authStore);

// Fetch initial authorization result from keychain
Keychain.getGenericPassword().then(res => {
  if (res) {
    try {
      const token = JSON.parse(res.password);
      authStore.getState().setAuthorizeResult(token);
    } catch (err) {
      console.error('Unable to read from keystore: ', err);
    }
  }
});

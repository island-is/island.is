import RNLocalize from 'react-native-localize';
import create, { State } from 'zustand/vanilla';
import { persist } from "zustand/middleware"
import createUse from 'zustand';
import AsyncStorage from '@react-native-community/async-storage';

export type Locale = 'en-US' | 'is-IS';
export type AppearanceMode = 'light' | 'dark' | 'automatic';

interface PreferencesStore extends State {
  hasOnboardedPinCode: boolean;
  hasOnboardedNotifications: boolean;
  hasAcceptedNotifications: boolean;
  useBiometrics: boolean;
  locale: Locale,
  appearanceMode: AppearanceMode;
  setLocale(locale: Locale): void;
  setAppearanceMode(appearanceMode: AppearanceMode): void;
  setUseBiometrics(useBiometrics: boolean): void;
}

const availableLocales: Locale[] = ['en-US', 'is-IS'];
const bestAvailableLanguage = RNLocalize.findBestAvailableLanguage(availableLocales)?.languageTag;

export const preferencesStore = create<PreferencesStore>(persist((set, get) => ({
  appearanceMode: 'light',
  locale: bestAvailableLanguage || 'is-IS',
  useBiometrics: false,
  hasOnboardedPinCode: false,
  hasOnboardedNotifications: false,
  hasAcceptedNotifications: false,
  setLocale(locale: Locale) {
    if (!availableLocales.includes(locale)) {
      throw new Error('Not supported locale');
    }
    set(() => ({ locale }));
  },
  setAppearanceMode(appearanceMode: AppearanceMode) {
    set(() => { appearanceMode })
  },
  setUseBiometrics(useBiometrics: boolean) {
    set(() => ({ useBiometrics }))
  }
}), {
  name: "preferences02",
  getStorage: () => AsyncStorage,
}));

export const usePreferencesStore = createUse(preferencesStore);

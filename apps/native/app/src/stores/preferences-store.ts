import RNLocalize from 'react-native-localize';
import create, { State } from 'zustand/vanilla';
import { persist } from "zustand/middleware"
import createUse from 'zustand';
import AsyncStorage from '@react-native-community/async-storage';

type Locale = 'en-US' | 'is-IS';
type AppearanceMode = 'light' | 'dark' | 'automatic';

interface PreferencesStore extends State {
  locale: Locale,
  appearanceMode: AppearanceMode;
  setLocale(locale: Locale): void;
  setAppearanceMode(appearanceMode: AppearanceMode): void;
}

const availableLocales: Locale[] = ['en-US', 'is-IS'];
const bestAvailableLanguage = RNLocalize.findBestAvailableLanguage(availableLocales)?.languageTag;

export const preferencesStore = create<PreferencesStore>(persist((set, get) => ({
  appearanceMode: 'light',
  locale: bestAvailableLanguage || 'is-IS',
  setLocale(locale: Locale) {
    if (!availableLocales.includes(locale)) {
      throw new Error('Not supported locale');
    }
    set(() => ({ locale }));
  },
  setAppearanceMode(appearanceMode: AppearanceMode) {
    set(() => { appearanceMode })
  }
}), {
  name: "preferences01",
  getStorage: () => AsyncStorage,
}));

export const userPreferencesStore = createUse(preferencesStore);

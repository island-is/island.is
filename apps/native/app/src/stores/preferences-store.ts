import RNLocalize from 'react-native-localize';
import create, { State } from 'zustand/vanilla';
import { persist } from "zustand/middleware"
import createUse from 'zustand';
import AsyncStorage from '@react-native-community/async-storage';

export type Locale = 'en-US' | 'is-IS';
export type AppearanceMode = 'light' | 'dark' | 'automatic';

interface PreferencesStore extends State {
  dev__useLockScreen: boolean;
  hasOnboardedPinCode: boolean;
  hasOnboardedBiometrics: boolean;
  hasOnboardedNotifications: boolean;
  hasAcceptedNotifications: boolean;
  useBiometrics: boolean;
  locale: Locale,
  appearanceMode: AppearanceMode;
  setLocale(locale: Locale): void;
  setAppearanceMode(appearanceMode: AppearanceMode): void;
  setUseBiometrics(useBiometrics: boolean): void;
  reset(): void;
}

const availableLocales: Locale[] = ['en-US', 'is-IS'];
const bestAvailableLanguage = RNLocalize.findBestAvailableLanguage(availableLocales)?.languageTag;
const defaultPreferences = {
  appearanceMode: 'light',
  locale: bestAvailableLanguage || 'is-IS',
  useBiometrics: false,
  dev__useLockScreen: true,
  hasOnboardedBiometrics: false,
  hasOnboardedPinCode: false,
  hasOnboardedNotifications: false,
  hasAcceptedNotifications: false,
};

let resolve: any = () => {};
export const rehydrate = () => new Promise(r => {
  resolve = r;
});

export const preferencesStore = create<PreferencesStore>(persist((set, get) => ({
  ...defaultPreferences as PreferencesStore,
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
  },
  reset() {
    set(() => defaultPreferences as PreferencesStore);
  }
}), {
  name: "preferences03",
  getStorage: () => AsyncStorage,
  onRehydrateStorage: () => {
    console.log('prefs rehydrated');
    resolve();
  }
}));

export const usePreferencesStore = createUse(preferencesStore);

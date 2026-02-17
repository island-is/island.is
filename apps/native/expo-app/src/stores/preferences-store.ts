import AsyncStorage from '@react-native-async-storage/async-storage'
import { create } from 'zustand'
import { useStore } from 'zustand/react'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Locale = 'en-US' | 'is-IS' | 'en-IS' | 'is-US'
export type ThemeMode = 'dark' | 'light' | 'efficient'
export type AppearanceMode = ThemeMode | 'automatic'

export const PREFERENCES_KEY = 'preferences_04'

export interface PreferencesStore {
  dev__useLockScreen: boolean
  hasOnboardedPinCode: boolean
  hasOnboardedBiometrics: boolean
  hasOnboardedNotifications: boolean
  hasAcceptedNotifications: boolean
  hasAcceptedBiometrics: boolean
  hasOnboardedPasskeys: boolean
  hasCreatedPasskey: boolean
  graphicWidgetEnabled: boolean
  inboxWidgetEnabled: boolean
  applicationsWidgetEnabled: boolean
  licensesWidgetEnabled: boolean
  vehiclesWidgetEnabled: boolean
  airDiscountWidgetEnabled: boolean
  widgetsInitialised: boolean
  skippedSoftUpdate: boolean
  lastUsedPasskey: number
  notificationsNewDocuments: boolean
  notificationsAppUpdates: boolean
  notificationsApplicationStatusUpdates: boolean
  dismissed: string[]
  walletPassDismissedInfoAlerts: Record<string, boolean>
  useBiometrics: boolean
  locale: Locale
  appearanceMode: AppearanceMode
  appLockTimeout: number
  pinTries: number
  setLocale(locale: Locale): void
  setAppearanceMode(appearanceMode: AppearanceMode): void
  setUseBiometrics(useBiometrics: boolean): void
  dismiss(key: string, value?: boolean): void
  setWalletPassInfoAlertDismissed(key: string): void
  reset(): void
}

const availableLocales: Locale[] = ['en-US', 'is-IS', 'is-US', 'en-IS']

const defaultPreferences = {
  appearanceMode: 'automatic',
  locale: 'is-IS',
  useBiometrics: false,
  dev__useLockScreen: true,
  hasOnboardedBiometrics: false,
  hasOnboardedPinCode: false,
  hasOnboardedNotifications: false,
  hasAcceptedNotifications: false,
  hasAcceptedBiometrics: false,
  hasOnboardedPasskeys: false,
  hasCreatedPasskey: false,
  graphicWidgetEnabled: true,
  inboxWidgetEnabled: true,
  applicationsWidgetEnabled: true,
  licensesWidgetEnabled: true,
  vehiclesWidgetEnabled: true,
  airDiscountWidgetEnabled: true,
  widgetsInitialised: false,
  skippedSoftUpdate: false,
  lastUsedPasskey: 0,
  notificationsNewDocuments: true,
  notificationsAppUpdates: true,
  notificationsApplicationStatusUpdates: true,
  dismissed: [] as string[],
  walletPassDismissedInfoAlerts: {} as Record<string, boolean>,
  appLockTimeout: 5000,
  pinTries: 0,
}

export const preferencesStore = create<PreferencesStore>()(
  persist(
    (set, get) => ({
      ...(defaultPreferences as PreferencesStore),
      setLocale(locale: Locale) {
        if (!availableLocales.includes(locale)) {
          throw new Error('Not supported locale')
        }

        set({ locale })
      },
      setAppearanceMode(appearanceMode: AppearanceMode) {
        set({ appearanceMode })
      },
      setUseBiometrics(useBiometrics: boolean) {
        set({ useBiometrics })
      },
      dismiss(key: string, value = true) {
        const now = get().dismissed
        if (value) {
          set({ dismissed: [...now, key] })
        } else {
          set({ dismissed: [...now.filter((k) => k !== key)] })
        }
      },
      setWalletPassInfoAlertDismissed(key: string) {
        const current = { ...get().walletPassDismissedInfoAlerts }
        if (current[key]) {
          return
        }

        current[key] = true
        set({ walletPassDismissedInfoAlerts: current })
      },
      reset() {
        set(defaultPreferences as PreferencesStore)
      },
    }),
    {
      name: PREFERENCES_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state, err) => {
        // @todo migration
        // if (state) {
        //   Navigation.setDefaultOptions(
        //     getDefaultOptions(getThemeWithPreferences(state)),
        //   )
        // }
      },
    },
  ),
)

export const usePreferencesStore = <U = PreferencesStore>(selector?: (state: PreferencesStore) => U) => useStore(preferencesStore, selector!)

import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import { create } from 'zustand'
import { useStore } from 'zustand/react'
import { createJSONStorage, persist } from 'zustand/middleware'

export type Locale = 'en-US' | 'is-IS' | 'en-IS' | 'is-US'
export type ThemeMode = 'dark' | 'light'
export type AppearanceMode = ThemeMode | 'automatic'

export const PREFERENCES_KEY = 'preferences_04'

export interface PreferencesStore {
  dev__useLockScreen: boolean
  /**
   * Whether this install has logged in. The keychain survives reinstalling on
   * iOS and preferences don't, so this tells a fresh install apart.
   */
  hasLoggedIn: boolean
  /**
   * The login screen tells someone who was logged in with an older version
   * why they have to log in again, until they do.
   */
  showReloginNotice: boolean
  hasOnboardedBiometrics: boolean
  hasOnboardedNotifications: boolean
  hasOnboardedPrivacy: boolean
  hasAcceptedNotifications: boolean
  /** Android cannot tell "never asked" from "declined", so remember that we asked. */
  hasRequestedNotificationsPermission: boolean
  /** Set by "decide later" at onboarding, so the home screen leaves them alone. */
  hasDeferredNotificationsOnboarding: boolean
  hasOnboardedPasskeys: boolean
  hasCreatedPasskey: boolean
  inboxWidgetEnabled: boolean
  applicationsWidgetEnabled: boolean
  licensesWidgetEnabled: boolean
  vehiclesWidgetEnabled: boolean
  airDiscountWidgetEnabled: boolean
  appointmentsWidgetEnabled: boolean
  notificationsWidgetEnabled: boolean
  widgetsInitialised: boolean
  skippedSoftUpdate: boolean
  lastUsedPasskey: number
  notificationsNewDocuments: boolean
  notificationsAppUpdates: boolean
  notificationsApplicationStatusUpdates: boolean
  dismissed: string[]
  walletPassDismissedInfoAlerts: Record<string, boolean>
  locale: Locale
  appearanceMode: AppearanceMode
  setLocale(locale: Locale): void
  setAppearanceMode(appearanceMode: AppearanceMode): void
  dismiss(key: string, value?: boolean): void
  setWalletPassInfoAlertDismissed(key: string): void
  reset(): void
}

const availableLocales: Locale[] = ['en-US', 'is-IS', 'is-US', 'en-IS']

const defaultPreferences = {
  appearanceMode: 'automatic',
  locale: 'is-IS',
  dev__useLockScreen: true,
  hasOnboardedBiometrics: false,
  hasLoggedIn: false,
  showReloginNotice: false,
  hasOnboardedNotifications: false,
  hasOnboardedPrivacy: false,
  hasAcceptedNotifications: false,
  hasRequestedNotificationsPermission: false,
  hasDeferredNotificationsOnboarding: false,
  hasOnboardedPasskeys: false,
  hasCreatedPasskey: false,
  inboxWidgetEnabled: true,
  applicationsWidgetEnabled: true,
  licensesWidgetEnabled: true,
  vehiclesWidgetEnabled: true,
  airDiscountWidgetEnabled: true,
  appointmentsWidgetEnabled: true,
  notificationsWidgetEnabled: true,
  widgetsInitialised: false,
  skippedSoftUpdate: false,
  lastUsedPasskey: 0,
  notificationsNewDocuments: true,
  notificationsAppUpdates: true,
  notificationsApplicationStatusUpdates: true,
  dismissed: [] as string[],
  walletPassDismissedInfoAlerts: {} as Record<string, boolean>,
}

let preferencesLoadedResolve!: () => void
const preferencesLoaded = new Promise<void>((resolve) => {
  preferencesLoadedResolve = resolve
})

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
      // Called on failure too, when onFinishHydration isn't: unreadable
      // preferences mustn't hold up the start.
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          console.warn('Could not load the preferences', error)
        }
        preferencesLoadedResolve()
      },
      version: 1,
      migrate: (persistedState: any, version) => {
        if (version === 0) {
          const wasFullyOnboarded =
            persistedState?.hasOnboardedPinCode &&
            persistedState?.hasOnboardedBiometrics &&
            (Platform.OS === 'android' ||
              persistedState?.hasOnboardedNotifications)
          return {
            ...persistedState,
            hasOnboardedPrivacy: !!wasFullyOnboarded,
          }
        }
        return persistedState
      },
    },
  ),
)

/**
 * Resolves once the saved preferences have loaded, or failed to, when the
 * defaults stay. Until then the store has the defaults, and a reset would be
 * overwritten when they arrive.
 */
export function waitForPreferences(): Promise<void> {
  return preferencesLoaded
}

export const usePreferencesStore = <U = PreferencesStore>(
  selector?: (state: PreferencesStore) => U,
) => useStore(preferencesStore, selector!)

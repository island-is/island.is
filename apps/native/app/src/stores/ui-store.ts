import {
  AuthenticationType,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { AppState } from 'react-native'
import { DefaultTheme } from 'styled-components/native'
import { create, useStore } from 'zustand'
import { verifyBiometricIntegrity } from '../utils/biometric-integrity'
import { isStrongBiometricsEnrolledAsync } from '../utils/biometrics'
import { authStore } from './auth-store'

export interface UIStore {
  theme?: DefaultTheme
  selectedTab: number
  unselectedTab: number
  focusedTab: string
  modalsOpen: number
  tabsHidden: boolean
  inboxQuery: string
  applicationQuery: string
  authenticationTypes: AuthenticationType[]
  isEnrolledBiometrics: boolean
  setInboxQuery(query: string): void
  setApplicationQuery(query: string): void
}

export const uiStore = create<UIStore>((set) => ({
  theme: undefined,
  selectedTab: 2,
  unselectedTab: 2,
  focusedTab: 'index',
  modalsOpen: 0,
  tabsHidden: false,
  inboxQuery: '',
  applicationQuery: '',
  authenticationTypes: [],
  isEnrolledBiometrics: false,
  setInboxQuery(inboxQuery: string) {
    set({ inboxQuery })
  },
  setApplicationQuery(applicationQuery: string) {
    set({ applicationQuery })
  },
}))

export const useUiStore = <U = UIStore>(selector?: (state: UIStore) => U) =>
  useStore(uiStore, selector!)

function updateBiometricsStatus() {
  supportedAuthenticationTypesAsync().then((authenticationTypes) => {
    uiStore.setState({ authenticationTypes })
  })
  isStrongBiometricsEnrolledAsync().then((isEnrolledBiometrics) => {
    uiStore.setState({ isEnrolledBiometrics })
  })
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    updateBiometricsStatus()
    // Only while signed in and unlocked. On cold start the app turns active
    // before the session loads, and while locked the lock screen runs the
    // same check before prompting — so the alert lands over the lock screen.
    const { authorizeResult, lockScreenActivatedAt } = authStore.getState()
    if (authorizeResult && lockScreenActivatedAt === undefined) {
      void verifyBiometricIntegrity()
    }
  }
})

updateBiometricsStatus()

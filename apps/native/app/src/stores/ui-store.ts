import {
  AuthenticationType,
  hasHardwareAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { AppState } from 'react-native'
import { DefaultTheme } from 'styled-components/native'
import { create, useStore } from 'zustand'

import {
  hasStrongBiometricHardwareAsync,
  isStrongBiometricsEnrolledAsync,
} from '../utils/biometrics'

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
  /** Biometrics that can unlock the app: on Android strong ones only. */
  isEnrolledBiometrics: boolean
  /**
   * False on a phone without biometrics, and on iOS also when the person has
   * turned them off for this app. Then the type is still known.
   */
  hasBiometricHardware: boolean
  /** Whether it can have biometrics that unlock the app, set up or not. */
  hasStrongBiometricHardware: boolean
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
  hasBiometricHardware: true,
  hasStrongBiometricHardware: true,
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
  hasStrongBiometricHardwareAsync().then((hasStrongBiometricHardware) => {
    uiStore.setState({ hasStrongBiometricHardware })
  })
  hasHardwareAsync().then((hasBiometricHardware) => {
    uiStore.setState({ hasBiometricHardware })
  })
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    updateBiometricsStatus()
  }
})

updateBiometricsStatus()

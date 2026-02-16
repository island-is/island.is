import {
  AuthenticationType,
  isEnrolledAsync,
  supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import { AppState } from 'react-native'
import { DefaultTheme } from 'styled-components/native'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'

export interface UIStore extends State {
  theme?: DefaultTheme
  selectedTab: number
  unselectedTab: number
  modalsOpen: number
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
  modalsOpen: 0,
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

export const useUiStore = createUse(uiStore)

function updateBiometricsStatus() {
  supportedAuthenticationTypesAsync().then((authenticationTypes) => {
    uiStore.setState({ authenticationTypes })
  })
  isEnrolledAsync().then((isEnrolledBiometrics) => {
    uiStore.setState({ isEnrolledBiometrics })
  })
}

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    updateBiometricsStatus()
  }
})

updateBiometricsStatus()

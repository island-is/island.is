// import { AuthenticationType, isEnrolledAsync, supportedAuthenticationTypesAsync } from 'expo-local-authentication'
import { AppState } from 'react-native'
import { DefaultTheme } from 'styled-components'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'
import { zustandFlipper } from '../utils/devtools/flipper-zustand'

export interface UIStore extends State {
  theme?: DefaultTheme
  selectedTab: number
  unselectedTab: number
  modalsOpen: number
  inboxQuery: string
  applicationQuery: string
  initializedApp: boolean
  // authenticationTypes: AuthenticationType[]
  isEnrolledBiometrics: boolean;
  setInboxQuery(query: string): void
  setApplicationQuery(query: string): void
}

export const uiStore = create<UIStore>((set, get) => ({
  theme: undefined,
  selectedTab: 1,
  unselectedTab: 1,
  modalsOpen: 0,
  inboxQuery: '',
  applicationQuery: '',
  initializedApp: false,
  // authenticationTypes: [],
  isEnrolledBiometrics: false,
  setInboxQuery(inboxQuery: string) {
    set({ inboxQuery })
  },
  setApplicationQuery(applicationQuery: string) {
    set({ applicationQuery })
  },
}))

export const useUiStore = createUse(uiStore)

zustandFlipper(uiStore, 'UIStore')

// function updateBiometricsStatus() {
//   supportedAuthenticationTypesAsync().then(authenticationTypes => {
//     uiStore.setState({ authenticationTypes });
//   });
//   isEnrolledAsync().then(isEnrolledBiometrics => {
//     uiStore.setState({ isEnrolledBiometrics });
//   });
// }

// AppState.addEventListener('change', (state) => {
//   if (state === 'active') {
//     updateBiometricsStatus();
//   }
// })

// updateBiometricsStatus();

import { DefaultTheme } from 'styled-components'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'
import { zustandFlipper } from '../utils/devtools/flipper-zustand'

export interface UIStore extends State {
  theme?: DefaultTheme
  selectedTab: number
  unselectedTab: number
  modalsOpen: number
  query: string
  applicationQuery: string
  initializedApp: boolean
  setQuery(query: string): void
  setApplicationQuery(query: string): void
}

export const uiStore = create<UIStore>((set, get) => ({
  theme: undefined,
  selectedTab: 1,
  unselectedTab: 1,
  modalsOpen: 0,
  query: '',
  applicationQuery: '',
  initializedApp: false,
  setQuery(query: string) {
    set({ query })
  },
  setApplicationQuery(applicationQuery: string) {
    set({ applicationQuery })
  },
}))

export const useUiStore = createUse(uiStore)

zustandFlipper(uiStore, 'UIStore')

import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'

export interface UIStore extends State {
  selectedTab: number
  unselectedTab: number
  query: string
  initializedApp: boolean
  setQuery(query: string): void
}

export const uiStore = create<UIStore>((set, get) => ({
  selectedTab: 1,
  unselectedTab: 1,
  query: '',
  initializedApp: false,
  setQuery(query: string) {
    set({ query })
  },
}))

export const useUiStore = createUse(uiStore)

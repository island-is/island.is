import { EdgeInsets, Rect } from 'react-native-safe-area-context'
import createUse from 'zustand'
import create, { State } from 'zustand/vanilla'

interface UIStore extends State {
  selectedTab: number
  unselectedTab: number
  query: string
}

export const uiStore = create<UIStore>((set, get) => ({
  selectedTab: 1,
  unselectedTab: 1,
  query: '',
}))

export const useUiStore = createUse(uiStore)

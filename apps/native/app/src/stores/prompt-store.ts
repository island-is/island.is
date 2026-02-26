import { KeyboardTypeOptions } from 'react-native'
import { create } from 'zustand'

export interface PromptOptions {
  title: string
  message?: string
  defaultValue?: string
  keyboardType?: KeyboardTypeOptions
  positiveText?: string
  negativeText?: string
  placeholder?: string
}

export interface PromptResult {
  action: 'positive' | 'negative' | 'dismiss'
  text?: string
}

interface PromptStore {
  visible: boolean
  options: PromptOptions | null
  resolve: ((result: PromptResult) => void) | null
  show(options: PromptOptions, resolve: (result: PromptResult) => void): void
  hide(): void
}

export const promptStore = create<PromptStore>((set) => ({
  visible: false,
  options: null,
  resolve: null,
  show: (options, resolve) => set({ visible: true, options, resolve }),
  hide: () => set({ visible: false, options: null, resolve: null }),
}))

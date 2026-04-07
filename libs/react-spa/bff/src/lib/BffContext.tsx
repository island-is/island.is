import { createContext } from 'react'

import { BffReducerState } from './bff.state'

export type BffContextType = BffReducerState & {
  signIn(): void
  signOut(): void
  switchUser(nationalId?: string, targetLink?: string): void
  bffUrlGenerator(
    relativePath?: string,
    params?: Record<string, string>,
  ): string
}

export const BffContext = createContext<BffContextType | undefined>(undefined)

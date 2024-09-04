import { createContext } from 'react'

import { BffReducerState } from './bff.state'

export interface BffContextType extends BffReducerState {
  signIn(): void
  signOut(): void
  switchUser(nationalId?: string): void
}

export const BffContext = createContext<BffContextType | undefined>(undefined)

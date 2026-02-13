import { createContext } from 'react'
import type { MatomoContextValue } from './types'

export const MatomoContext = createContext<MatomoContextValue | null>(null)

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext } from 'react'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalNamespaceProps {
  globalNamespace: NamespaceType
}

export const GlobalNamespaceContext = createContext<GlobalNamespaceProps>({
  globalNamespace: {},
})

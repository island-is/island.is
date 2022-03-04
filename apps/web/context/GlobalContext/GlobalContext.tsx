/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, createContext, useState } from 'react'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalContextProps {
  globalNamespace: NamespaceType
  contentfulId: string
  setGlobalNamespace: (ns: NamespaceType) => void
  setContentfulId: (id: string) => void
}

export interface GlobalContextProviderProps {
  namespace?: NamespaceType
}

export const GlobalContext = createContext<GlobalContextProps>({
  globalNamespace: {},
  contentfulId: '',
  setGlobalNamespace: () => null,
  setContentfulId: () => null,
})

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  namespace = {},
  children,
}) => {
  const setContentfulId = (id: string) => {
    setState({ ...state, contentfulId: id })
  }

  const setGlobalNamespace = (ns: NamespaceType) => {
    setState({ ...state, globalNamespace: ns })
  }

  const initialState = {
    globalNamespace: namespace,
    contentfulId: '',
    setGlobalNamespace,
    setContentfulId,
  }

  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext

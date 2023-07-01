/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, createContext, useState } from 'react'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalContextProps {
  globalNamespace: NamespaceType
  isServiceWeb?: boolean
  contentfulIds: string[]
  resolveLinkTypeLocally?: boolean
  setGlobalNamespace: (ns: NamespaceType) => void
  setContentfulIds: (ids: string[]) => void
  setResolveLinkTypeLocally: (localResolution: boolean) => void
}

export interface GlobalContextProviderProps {
  namespace?: NamespaceType
  isServiceWeb?: boolean
}

export const GlobalContext = createContext<GlobalContextProps>({
  globalNamespace: {},
  contentfulIds: [],
  resolveLinkTypeLocally: false,
  setGlobalNamespace: () => null,
  setContentfulIds: () => null,
  setResolveLinkTypeLocally: () => null,
})

export const GlobalContextProvider: FC<
  React.PropsWithChildren<GlobalContextProviderProps>
> = ({ namespace = {}, isServiceWeb = false, children }) => {
  const setContentfulIds = (ids: string[]) => {
    setState((prevState) => ({
      ...prevState,
      contentfulIds: ids,
    }))
  }

  const setGlobalNamespace = (ns: NamespaceType) => {
    setState((prevState) => ({ ...prevState, globalNamespace: ns }))
  }

  const setResolveLinkTypeLocally = (localResolution: boolean) => {
    setState((prevState) => ({
      ...prevState,
      resolveLinkTypeLocally: localResolution,
    }))
  }

  const initialState: GlobalContextProps = {
    globalNamespace: namespace,
    isServiceWeb,
    contentfulIds: [],
    setGlobalNamespace,
    setContentfulIds,
    setResolveLinkTypeLocally,
  }

  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext

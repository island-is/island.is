/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, createContext, useState } from 'react'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalContextProps {
  globalNamespace: NamespaceType
  shouldLinkToServiceWeb?: boolean
  isServiceWeb?: boolean
  pageContentfulId: string
  subpageContentfulId?: string
  resolveLinkTypeLocally?: boolean
  setGlobalNamespace: (ns: NamespaceType) => void
  setContentfulId: (pageId: string, subpageId?: string) => void
  setResolveLinkTypeLocally: (localResolution: boolean) => void
}

export interface GlobalContextProviderProps {
  namespace?: NamespaceType
  isServiceWeb?: boolean
  shouldLinkToServiceWeb?: boolean
}

export const GlobalContext = createContext<GlobalContextProps>({
  globalNamespace: {},
  pageContentfulId: '',
  subpageContentfulId: '',
  resolveLinkTypeLocally: false,
  setGlobalNamespace: () => null,
  setContentfulId: () => null,
  setResolveLinkTypeLocally: () => null,
})

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  namespace = {},
  shouldLinkToServiceWeb = false,
  isServiceWeb = false,
  children,
}) => {
  const setContentfulId = (pageId: string, subpageId?: string) => {
    setState((prevState) => ({
      ...prevState,
      pageContentfulId: pageId,
      subpageContentfulId: subpageId,
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
    shouldLinkToServiceWeb,
    isServiceWeb,
    pageContentfulId: '',
    subpageContentfulId: '',
    setGlobalNamespace,
    setContentfulId,
    setResolveLinkTypeLocally,
  }

  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext

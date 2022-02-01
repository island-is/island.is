/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FC, createContext, useState } from 'react'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalContextProps {
  globalNamespace: NamespaceType
  pageContentfulId: string
  subpageContentfulId?: string
  subpageSlug?: string
  setGlobalNamespace: (ns: NamespaceType) => void
  setContentfulId: (pageId: string, subpageId?: string) => void
  setSubpageSlug: (slug: string) => void
}

export interface GlobalContextProviderProps {
  namespace?: NamespaceType
}

export const GlobalContext = createContext<GlobalContextProps>({
  globalNamespace: {},
  pageContentfulId: '',
  subpageContentfulId: '',
  subpageSlug: '',
  setGlobalNamespace: () => null,
  setContentfulId: () => null,
  setSubpageSlug: () => null,
})

export const GlobalContextProvider: FC<GlobalContextProviderProps> = ({
  namespace = {},
  children,
}) => {
  const setContentfulId = (pageId: string, subpageId?: string) => {
    setState({
      ...state,
      pageContentfulId: pageId,
      subpageContentfulId: subpageId,
    })
  }

  const setGlobalNamespace = (ns: NamespaceType) => {
    setState({ ...state, globalNamespace: ns })
  }

  const setSubpageSlug = (slug: string) => {
    setState({ ...state, subpageSlug: slug })
  }

  const initialState: GlobalContextProps = {
    globalNamespace: namespace,
    pageContentfulId: '',
    subpageContentfulId: '',
    setGlobalNamespace,
    setContentfulId,
    setSubpageSlug,
  }

  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext

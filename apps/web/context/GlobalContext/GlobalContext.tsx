/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, FC, useState } from 'react'

import type { LinkType } from '@island.is/web/hooks'

export type NamespaceType = {
  [key: string]: any
}

export interface GlobalContextProps {
  globalNamespace: NamespaceType
  isServiceWeb?: boolean
  contentfulIds: string[]
  resolveLinkTypeLocally?: boolean
  linkType?: LinkType | null
  setGlobalNamespace: (ns: NamespaceType) => void
  setContentfulIds: (ids: string[]) => void
  setResolveLinkTypeLocally: (localResolution: boolean) => void
  setLinkType: (linkType: LinkType | null) => void
}

export interface GlobalContextProviderProps {
  namespace?: NamespaceType
  isServiceWeb?: boolean
}

export const GlobalContext = createContext<GlobalContextProps>({
  globalNamespace: {},
  contentfulIds: [],
  resolveLinkTypeLocally: false,
  linkType: null,
  setGlobalNamespace: () => null,
  setContentfulIds: () => null,
  setResolveLinkTypeLocally: () => null,
  setLinkType: () => null,
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

  const setLinkType = (linkType: LinkType | null) => {
    setState((prevState) => ({
      ...prevState,
      linkType: linkType,
    }))
  }

  const initialState: GlobalContextProps = {
    globalNamespace: namespace,
    isServiceWeb,
    contentfulIds: [],
    setGlobalNamespace,
    setContentfulIds,
    setResolveLinkTypeLocally,
    setLinkType,
  }

  const [state, setState] = useState(initialState)

  return (
    <GlobalContext.Provider value={state}>{children}</GlobalContext.Provider>
  )
}

export default GlobalContext

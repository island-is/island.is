/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button } from '@island.is/island-ui/core'
import React, { FC, createContext, useState } from 'react'
import { environment } from '../../environments/environment'

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

const {
  editButton: { enable, clientSpace },
} = environment

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

  const handleButtonClick = async () => {
    window.open(
      `https://app.contentful.com/spaces/${clientSpace}/entries/${state.contentfulId}`,
      '_blank',
    )
  }

  return (
    <GlobalContext.Provider value={state}>
      {children}

      {enable && state.contentfulId !== '' && (
        <Box position="fixed" left={20} bottom={20}>
          <Button onClick={handleButtonClick}>Edit in Contentful</Button>
        </Box>
      )}
    </GlobalContext.Provider>
  )
}

export default GlobalContext

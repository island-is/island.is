import React, { createContext, useContext, ReactElement } from 'react'

import { BoxProps } from '../../Box/types'

export type BackgroundVariant = BoxProps['background']

const backgroundContext = createContext<BackgroundVariant | null>(null)

export const BackgroundProvider = backgroundContext.Provider

export const renderBackgroundProvider = (
  background: BackgroundVariant,
  element: ReactElement | null,
) =>
  background ? (
    <BackgroundProvider value={background}>{element}</BackgroundProvider>
  ) : (
    element
  )

export const useBackground = () => useContext(backgroundContext)

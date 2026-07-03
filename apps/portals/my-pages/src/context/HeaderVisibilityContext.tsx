import { createContext, useContext } from 'react'
import { SERVICE_PORTAL_HEADER_HEIGHT_SM } from '@island.is/portals/my-pages/constants'

interface HeaderVisibilityContextType {
  headerVisible: boolean
  setHeaderVisible: (visible: boolean) => void
  /**
   * Measured height of the fixed header element, including anything
   * rendered inside it (e.g. the delegation banner).
   */
  headerHeight: number
}

export const HeaderVisibilityContext =
  createContext<HeaderVisibilityContextType>({
    headerVisible: true,
    setHeaderVisible: () => {
      // Default implementation - will be overridden by provider
    },
    headerHeight: SERVICE_PORTAL_HEADER_HEIGHT_SM,
  })

export const useHeaderVisibility = () => {
  const context = useContext(HeaderVisibilityContext)
  if (!context) {
    throw new Error(
      'useHeaderVisibility must be used within a HeaderVisibilityProvider',
    )
  }
  return context
}

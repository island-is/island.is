import { createContext, useContext } from 'react'

interface HeaderVisibilityContextType {
  headerVisible: boolean
  setHeaderVisible: (visible: boolean) => void
}

export const HeaderVisibilityContext =
  createContext<HeaderVisibilityContextType>({
    headerVisible: true,
    setHeaderVisible: () => {
      // Default implementation - will be overridden by provider
    },
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

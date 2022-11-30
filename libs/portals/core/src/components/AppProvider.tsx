import { createContext, useContext } from 'react'
import { PortalNavigationItem } from '../types/portalCore'

export type AppContextProps = {
  masterNavigation: PortalNavigationItem[]
  basePath: string
}

const AppContext = createContext<AppContextProps>({
  masterNavigation: [],
  basePath: '',
})

interface AppProviderProps {
  masterNavigation: PortalNavigationItem[]
  basePath: string
  children: React.ReactNode
}

export const AppProvider = ({
  masterNavigation,
  basePath,
  children,
}: AppProviderProps) => {
  return (
    <AppContext.Provider
      value={{
        masterNavigation,
        basePath,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)

  if (context === undefined) {
    throw new Error('useApp must be used under AppProvider')
  }

  return context
}

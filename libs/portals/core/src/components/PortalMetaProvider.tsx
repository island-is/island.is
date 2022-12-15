import { createContext, useContext } from 'react'
import { PortalNavigationItem } from '../types/portalCore'

export type PortalMetaContextProps = {
  basePath: string
  masterNav?: PortalNavigationItem
}

const PortalMetaContext = createContext<PortalMetaContextProps>({
  basePath: '',
  masterNav: undefined,
})

type PortalMetaProviderProps = PortalMetaContextProps & {
  children: React.ReactNode
}

export const PortalMetaProvider = ({
  basePath,
  masterNav,
  children,
}: PortalMetaProviderProps) => {
  return (
    <PortalMetaContext.Provider
      value={{
        basePath,
        masterNav,
      }}
    >
      {children}
    </PortalMetaContext.Provider>
  )
}

export const usePortalMeta = () => {
  const context = useContext(PortalMetaContext)

  if (context === undefined) {
    throw new Error('usePortalMeta must be used under PortalMetaProvider')
  }

  return context
}

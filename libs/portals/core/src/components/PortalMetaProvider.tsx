import { createContext, useContext } from 'react'
import { PortalNavigationItem, PortalType } from '../types/portalCore'

export type PortalMetaContextProps = {
  portalType: PortalType
  basePath: string
  masterNav?: PortalNavigationItem
}

const PortalMetaContext = createContext<PortalMetaContextProps>({
  portalType: 'my-pages',
  basePath: '',
  masterNav: undefined,
})

type PortalMetaProviderProps = PortalMetaContextProps & {
  portalType: PortalType
  children: React.ReactNode
}

export const PortalMetaProvider = ({
  portalType,
  basePath,
  masterNav,
  children,
}: PortalMetaProviderProps) => {
  return (
    <PortalMetaContext.Provider
      value={{
        portalType,
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

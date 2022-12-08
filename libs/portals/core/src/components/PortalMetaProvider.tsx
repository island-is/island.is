import { createContext, useContext } from 'react'

export type PortalMetaContextProps = {
  basePath: string
}

const PortalMetaContext = createContext<PortalMetaContextProps>({
  basePath: '',
})

interface PortalMetaProviderProps {
  basePath: string
  children: React.ReactNode
}

export const PortalMetaProvider = ({
  basePath,
  children,
}: PortalMetaProviderProps) => {
  return (
    <PortalMetaContext.Provider
      value={{
        basePath,
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

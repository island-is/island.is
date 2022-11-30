import {
  useApolloClient,
  NormalizedCacheObject,
  ApolloClient,
} from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { createContext, useContext, useEffect, useState } from 'react'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'
import { PortalModule, PortalRoute } from '../types/portalCore'
import { arrangeRoutes, filterEnabledModules } from '../utils/modules'

export type ModulesContextProps = {
  modules: PortalModule[]
  companyModules?: string[]
  routes: PortalRoute[]
  loading: boolean
}

const ModulesContext = createContext<ModulesContextProps>({
  modules: [],
  companyModules: undefined,
  loading: false,
  routes: [],
})

interface ModuleProviderProps {
  modules: PortalModule[]
  companyModules?: PortalModule[]
  children: React.ReactNode
}

export const ModulesProvider = ({
  modules: initialModules,
  children,
}: ModuleProviderProps) => {
  const { userInfo } = useAuth()
  const featureFlagClient = useFeatureFlagClient()
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<PortalModule[]>(initialModules)
  const [routes, setRoutes] = useState<PortalRoute[]>([])

  useEffect(() => {
    setLoading(true)

    if (userInfo) {
      filterEnabledModules({
        modules,
        userInfo,
        featureFlagClient,
      })
        .then((filteredModules) => {
          setModules(filteredModules)

          return arrangeRoutes({
            modules: Object.values(filteredModules),
            featureFlagClient,
            userInfo,
            apolloClient,
          })
        })
        .then((routes) => setRoutes(routes))
        .catch((error) => setError(error))
        .finally(() => setLoading(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo])

  if (error) {
    throw error
  }

  return (
    <ModulesContext.Provider
      value={{
        modules,
        routes,
        loading,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </ModulesContext.Provider>
  )
}

export const useModules = () => {
  const context = useContext(ModulesContext)

  if (context === undefined) {
    throw new Error('useModules must be used under ModulesProvider')
  }

  return context
}

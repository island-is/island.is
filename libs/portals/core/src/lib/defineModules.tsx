import {
  useApolloClient,
  NormalizedCacheObject,
  ApolloClient,
} from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { Context, createContext, useContext, useEffect, useState } from 'react'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'
import { PortalModule, PortalRoute } from '../types/portalCore'
import { arrangeRoutes, filterEnabledModules } from '../utils/modules'

export type ModulesContextProps<ModuleKeys extends string> = {
  modules: Record<ModuleKeys, PortalModule>
  companyModules?: ModuleKeys[]
  routes: PortalRoute[]
  loading: boolean
}

const createUseModules = <ModulesKeys extends string>(
  modulesContext: Context<ModulesContextProps<ModulesKeys>>,
) => {
  return () => {
    const context = useContext(modulesContext)

    if (context === undefined) {
      throw new Error('useModules must be used under ModulesProvider')
    }

    return context
  }
}

interface ModuleProviderProps<ModulesKeys extends string> {
  modules: Record<ModulesKeys, PortalModule>
  children: React.ReactNode
}

const createModulesProvider = <ModulesKeys extends string>(
  ModulesContext: Context<ModulesContextProps<ModulesKeys>>,
  companyModules?: ModulesKeys[],
) => {
  return ({
    modules: initialModules,
    children,
  }: ModuleProviderProps<ModulesKeys>) => {
    const { userInfo } = useAuth()
    const featureFlagClient = useFeatureFlagClient()
    const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(true)
    const [modules, setModules] = useState<Record<ModulesKeys, PortalModule>>(
      initialModules,
    )
    const [routes, setRoutes] = useState<PortalRoute[]>([])

    useEffect(() => {
      setLoading(true)

      if (userInfo) {
        filterEnabledModules({
          modules,
          companyModules,
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
}

/**
 * Wrapper function to create provider and hook for modules context.
 */
export const defineModules = <ModulesKeys extends string>({
  modules,
  companyModules,
}: {
  modules: Record<ModulesKeys, PortalModule>
  companyModules?: ModulesKeys[]
}) => {
  const ModulesContext = createContext<ModulesContextProps<ModulesKeys>>({
    modules,
    companyModules,
    loading: false,
    routes: [],
  })

  const ModulesProvider = createModulesProvider(ModulesContext, companyModules)
  const useModules = createUseModules(ModulesContext)

  return {
    useModules,
    ModulesProvider,
  }
}

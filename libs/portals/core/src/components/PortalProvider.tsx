import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocation, matchPath } from 'react-router-dom'
import {
  useApolloClient,
  NormalizedCacheObject,
  ApolloClient,
} from '@apollo/client'
import { useAuth } from '@island.is/auth/react'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { LoadingScreen } from '../components/LoadingScreen/LoadingScreen'
import { PortalModule, PortalRoute, PortalType } from '../types/portalCore'
import { arrangeRoutes, filterEnabledModules } from '../utils/modules'

type PortalMeta = {
  portalType: PortalType
  basePath: string
}

export type PortalContextProps = {
  meta: PortalMeta
  modules: PortalModule[]
  activeModule?: PortalModule
  routes: PortalRoute[]
}

const PortalContext = createContext<PortalContextProps | undefined>(undefined)

interface PortalProviderProps {
  modules: PortalModule[]
  meta: PortalMeta
  children: React.ReactNode
}

export const PortalProvider = ({
  modules: initialModules,
  meta,
  children,
}: PortalProviderProps) => {
  const { pathname } = useLocation()
  const { userInfo } = useAuth()
  const featureFlagClient = useFeatureFlagClient()
  const apolloClient = useApolloClient() as ApolloClient<NormalizedCacheObject>
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState<PortalModule[]>(initialModules)
  const [routes, setRoutes] = useState<PortalRoute[]>([])

  const activeModule = useMemo(() => {
    return userInfo
      ? modules.find((module) =>
          module
            // Get all routes for the module
            .routes({
              userInfo,
              client: apolloClient,
            })
            // Extract the path from each route
            .map(({ path }) => path)
            // Find the route path that matches the current pathname
            .find((path) => matchPath(path, pathname)),
        )
      : undefined
  }, [userInfo, modules, apolloClient, pathname])

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
    <PortalContext.Provider
      value={{
        modules,
        meta,
        routes,
        activeModule,
      }}
    >
      {loading ? <LoadingScreen /> : children}
    </PortalContext.Provider>
  )
}

const useDynamicHook = <T extends keyof PortalContextProps>(
  fnName: string,
  key: T,
): PortalContextProps[T] => {
  const context = useContext(PortalContext)

  if (context === undefined) {
    throw new Error(`${fnName} must be used under ModulesProvider`)
  }

  return context[key]
}

export const useModules = () => useDynamicHook(useModules.name, 'modules')
export const useRoutes = () => useDynamicHook(useRoutes.name, 'routes')
export const useActiveModule = () =>
  useDynamicHook(useActiveModule.name, 'activeModule')
export const usePortalMeta = () => useDynamicHook(usePortalMeta.name, 'meta')

import {
  ApolloClient,
  NormalizedCacheObject,
  useApolloClient,
} from '@apollo/client'
import { useLocale } from '@island.is/localization'
import { useUserInfo } from '@island.is/react-spa/bff'
import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { Outlet, matchPath, useLocation } from 'react-router-dom'
import { PortalModule, PortalRoute, PortalType } from '../types/portalCore'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

export type PortalMeta = {
  portalType: PortalType
  basePath: string
  portalTitle: string
}

export type PortalContextProps = {
  activeModule?: PortalModule
  meta: PortalMeta
  modules: PortalModule[]
  routes: PortalRoute[]
}

export const PortalContext = createContext<PortalContextProps | undefined>(
  undefined,
)

type PortalProviderProps = Omit<PortalContextProps, 'activeModule'>

const spreadRoutsChildren = (routes: PortalRoute[]) => {
  const children = routes.map((route) => {
    if (route.children) {
      return [route, ...spreadRoutsChildren(route.children)]
    }
    return route
  }) as PortalRoute[]
  return children.flat()
}

export const PortalProvider = ({
  meta,
  modules,
  routes,
}: PortalProviderProps) => {
  const { pathname } = useLocation()
  const userInfo = useUserInfo()
  const { formatMessage } = useLocale()
  const client = useApolloClient() as ApolloClient<NormalizedCacheObject>
  const featureFlagClient = useFeatureFlagClient()

  const [activeModule, setActiveModule] = useState<PortalModule | undefined>()

  useEffect(() => {
    const findActiveModule = async () => {
      if (!userInfo) {
        setActiveModule(undefined)
        return
      }

      for (const module of modules) {
        const routes = await module.routes({
          userInfo,
          client,
          formatMessage,
          featureFlagClient,
        })

        const paths = spreadRoutsChildren(routes).map(({ path }) => path)
        const hasMatchingRoute = paths.find(
          (path) => path && matchPath(path, pathname),
        )

        if (hasMatchingRoute) {
          setActiveModule(module)
          return
        }
      }

      setActiveModule(undefined)
    }

    findActiveModule()
  }, [modules, pathname, userInfo, featureFlagClient, client, formatMessage])

  return (
    <PortalContext.Provider
      value={{
        modules,
        meta,
        routes,
        activeModule,
      }}
    >
      <Outlet />
    </PortalContext.Provider>
  )
}

const useDynamicHook = <T extends keyof PortalContextProps>(
  fnName: string,
  key: T,
): PortalContextProps[T] => {
  const context = useContext(PortalContext)

  if (context === undefined) {
    throw new Error(`${fnName} must be used under PortalProvider`)
  }

  return context[key]
}

export const useModules = () => useDynamicHook(useModules.name, 'modules')
export const useRoutes = () => useDynamicHook(useRoutes.name, 'routes')
export const useActiveModule = () =>
  useDynamicHook(useActiveModule.name, 'activeModule')
export const usePortalMeta = () => useDynamicHook(usePortalMeta.name, 'meta')

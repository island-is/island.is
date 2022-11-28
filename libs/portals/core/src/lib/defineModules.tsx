import { useAuth } from '@island.is/auth/react'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { Context, createContext, useContext, useEffect, useState } from 'react'
import { PortalModule, PortalRoute } from '../types/portalCore'
import { filterEnabledModules } from '../utils/modules'

type ModulesContextValues<ModuleKeys extends string> = {
  modules: Record<ModuleKeys, PortalModule>
  companyModules?: ModuleKeys[]
  routes: PortalRoute[]
  loading: boolean
}

const createUseModules = <ModulesKeys extends string>(
  modulesContext: Context<ModulesContextValues<ModulesKeys>>,
) => {
  return () => {
    const context = useContext(modulesContext)

    if (context === undefined) {
      throw new Error('useModules must be used under ModulesProvider')
    }
    return context
  }
}

const createModulesContext = <ModulesKeys extends string>(
  initialState: ModulesContextValues<ModulesKeys>,
) => {
  return createContext<ModulesContextValues<ModulesKeys>>(initialState)
}

interface ModuleProviderProps<ModulesKeys extends string> {
  modules: Record<ModulesKeys, PortalModule>
  children: React.ReactNode
}

const createModulesProvider = <ModulesKeys extends string>(
  ModulesContext: Context<ModulesContextValues<ModulesKeys>>,
  companyModules?: ModulesKeys[],
) => {
  return ({
    modules: initialModules,
    children,
  }: ModuleProviderProps<ModulesKeys>) => {
    const { userInfo } = useAuth()
    const featureFlagClient = useFeatureFlagClient()
    const [loading, setLoading] = useState(true)
    const [modules, setModules] = useState<Record<ModulesKeys, PortalModule>>(
      initialModules,
    )

    useEffect(() => {
      setLoading(true)

      filterEnabledModules({
        modules,
        companyModules,
        userInfo,
        featureFlagClient,
      })
        .then((filteredModules) => setModules(filteredModules))
        .finally(() => setLoading(false))
    }, [])

    return (
      <ModulesContext.Provider
        value={{
          modules,
          routes: [],
          loading,
        }}
      >
        {children}
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
  const ModulesContext = createModulesContext<ModulesKeys>({
    modules,
    companyModules,
    loading: false,
    routes: [],
  })
  const useModules = createUseModules(ModulesContext)
  const ModulesProvider = createModulesProvider(ModulesContext, companyModules)

  return {
    useModules,
    ModulesProvider,
  }
}

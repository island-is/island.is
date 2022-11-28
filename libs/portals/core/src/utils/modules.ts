import { User } from '@island.is/shared/types'
import { FeatureFlagClient } from '@island.is/feature-flags'
import { PortalModule } from '../types/portalCore'

type FilterEnabledModulesArgs<ModulesKeys extends string> = {
  modules: Record<ModulesKeys, PortalModule>
  featureFlagClient: FeatureFlagClient
  companyModules?: ModulesKeys[]
  userInfo: User | null
}

export const filterEnabledModules = async <ModulesKeys extends string>({
  modules,
  companyModules,
  featureFlagClient,
  userInfo,
}: FilterEnabledModulesArgs<ModulesKeys>) => {
  const filteredModules: Record<string, PortalModule> = {}
  const isCompany = userInfo?.profile?.subjectType === 'legalEntity'
  const moduleEntries = Object.entries(modules) as [ModulesKeys, PortalModule][]

  for (const [moduleKey, module] of moduleEntries) {
    let enabled = true

    if (enabled && isCompany && !companyModules?.includes(moduleKey)) {
      enabled = false
    }

    if (enabled && module.featureFlag) {
      enabled = Boolean(
        await featureFlagClient.getValue(module.featureFlag, false),
      )
    }

    if (enabled) {
      filteredModules[moduleKey] = module
    }
  }

  return filteredModules
}

import { useEffect } from 'react'

import { useAuth } from '@island.is/auth/react'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { ModuleKeys, companyModules } from '../../store/modules'

export const useModules = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [{ modules }, dispatch] = useStore()
  const { userInfo } = useAuth()

  async function filterEnabledModules() {
    const isCompany = userInfo?.profile?.subjectType === 'legalEntity'
    const moduleEntries = Object.entries(modules) as [
      ModuleKeys,
      ServicePortalModule,
    ][]
    const filteredModules: Record<string, ServicePortalModule> = {}

    for (const [moduleKey, module] of moduleEntries) {
      let enabled = true

      if (enabled && isCompany && !companyModules.includes(moduleKey)) {
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

    dispatch({
      type: ActionType.SetModulesList,
      payload: filteredModules,
    })
  }

  useEffect(() => {
    filterEnabledModules()
  }, [])
}

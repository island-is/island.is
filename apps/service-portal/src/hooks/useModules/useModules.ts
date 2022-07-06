import { useEffect } from 'react'

import { useAuth } from '@island.is/auth/react'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'

import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import {
  featureFlaggedModules,
  featureFlaggedCompanyModules,
  ModuleKeys,
  companyModules,
} from '../../store/modules'

export const useModules = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [{ modules }, dispatch] = useStore()
  const { userInfo } = useAuth()

  async function filterModulesBasedOnFeatureFlags() {
    const flagValues = await Promise.all(
      featureFlaggedModules.map((moduleKey) => {
        const capKey = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)
        return featureFlagClient.getValue(
          `isServicePortal${capKey}ModuleEnabled`,
          false,
        )
      }),
    )

    const companyFlagValues = await Promise.all(
      featureFlaggedCompanyModules.map((moduleKey) => {
        const capKey = moduleKey.charAt(0).toUpperCase() + moduleKey.slice(1)
        return featureFlagClient.getValue(
          `isServicePortalCompany${capKey}ModuleEnabled`,
          false,
        )
      }),
    )

    const filteredModules = Object.entries(modules).reduce(
      (ffModules, [moduleKey, module]) => {
        const index = featureFlaggedModules.indexOf(moduleKey as ModuleKeys)
        if (index >= 0 && !flagValues[index]) {
          return ffModules
        }

        /**
         * If logged in as a company, only include the company modules.
         */
        const IS_COMPANY = userInfo?.profile?.subjectType === 'legalEntity'
        if (IS_COMPANY && !companyModules.includes(moduleKey as ModuleKeys)) {
          return ffModules
        }

        /**
         * Company feature flags
         */
        const companyModuleIndex = featureFlaggedCompanyModules.indexOf(
          moduleKey as ModuleKeys,
        )
        if (
          IS_COMPANY &&
          companyModuleIndex >= 0 &&
          !companyFlagValues[companyModuleIndex]
        ) {
          return ffModules
        }

        return { ...ffModules, [moduleKey]: module }
      },
      {} as Record<ModuleKeys, ServicePortalModule>,
    )

    dispatch({
      type: ActionType.SetModulesList,
      payload: filteredModules,
    })
  }

  useEffect(() => {
    filterModulesBasedOnFeatureFlags()
  }, [])
}

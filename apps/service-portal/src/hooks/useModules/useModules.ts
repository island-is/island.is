import { useEffect } from 'react'

import { useAuth } from '@island.is/auth/react'
import { ServicePortalModule } from '@island.is/service-portal/core'
import { useFeatureFlagClient } from '@island.is/feature-flags'

import { useStore } from '../../store/stateProvider'
import { ActionType } from '../../store/actions'
import { featureFlaggedModules, ModuleKeys } from '../../store/modules'

export const useModules = () => {
  const featureFlagClient = useFeatureFlagClient()
  const [{ modules }, dispatch] = useStore()

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

    const filteredModules = Object.entries(modules).reduce(
      (ffModules, [moduleKey, module]) => {
        const index = featureFlaggedModules.indexOf(moduleKey as ModuleKeys)
        if (index >= 0 && !flagValues[index]) {
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

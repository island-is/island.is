import { useEffect } from 'react'

import { useAuth } from '@island.is/auth/react'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { ServicePortalModule } from '@island.is/service-portal/core'

import { ActionType } from '../../store/actions'
import { featureFlaggedModules, ModuleKeys } from '../../store/modules'
import { useStore } from '../../store/stateProvider'

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

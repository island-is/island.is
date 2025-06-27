import { useEffect, useState } from 'react'
import { useFeatureFlagClient, Features } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'
import { parseDelegationTypeFeatureFlagValue } from '../utils/parseDelegationTypeFeatureFlagValue'

export const useDelegationTypeFeatureFlag = () => {
  const userInfo = useUserInfo()
  const featureFlagCLI = useFeatureFlagClient()

  const [isDelegationTypeEnabled, setIsDelegationTypeEnabled] = useState(false)
  const [isCheckingFeatureFlag, setIsCheckingFeatureFlag] = useState(false)

  const isActor = !!userInfo?.profile?.actor?.nationalId

  useEffect(() => {
    // If the user is an actor, we need to check if the delegation types feature flag is enabled
    if (isActor) {
      const { profile } = userInfo

      const checkFeatureFlag = async () => {
        setIsCheckingFeatureFlag(true)
        const featureFlagValue = await featureFlagCLI.getValue(
          Features.delegationTypesWithNotificationsEnabled,
          '',
          {
            id: profile?.nationalId || '',
            attributes: {},
          },
        )

        const isEnabled = parseDelegationTypeFeatureFlagValue({
          featureFlagValue,
          delegationTypes: profile?.delegationType,
          actorNationalId: profile?.nationalId,
        })

        setIsDelegationTypeEnabled(isEnabled)
        setIsCheckingFeatureFlag(false)
      }

      checkFeatureFlag()
    } else {
      // If the user is not an actor, we assume that they are not a company and that they dont need to be flagged
      setIsDelegationTypeEnabled(true)
      setIsCheckingFeatureFlag(false)
    }
  }, [isActor, featureFlagCLI, userInfo])

  return {
    isDelegationTypeEnabled,
    isCheckingFeatureFlag,
    isActor,
  }
}

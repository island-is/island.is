import { useEffect, useState } from 'react'
import * as kennitala from 'kennitala'
import { useFeatureFlagClient, Features } from '@island.is/react/feature-flags'
import { useUserInfo } from '@island.is/react-spa/bff'
import { AuthDelegationType } from '@island.is/shared/types'

export const useDelegationTypeFeatureFlag = () => {
  const userInfo = useUserInfo()
  const featureFlagCLI = useFeatureFlagClient()

  const [isDelegationTypeEnabled, setIsDelegationTypeEnabled] = useState(false)
  const [isCheckingFeatureFlag, setIsCheckingFeatureFlag] = useState(false)

  const isActor = !!userInfo?.profile?.actor?.nationalId

  useEffect(() => {
    // If the user is an actor, we need to check if the delegation types feature flag is enabled
    if (isActor) {
      const { delegationType } = userInfo?.profile

      const checkFeatureFlag = async () => {
        setIsCheckingFeatureFlag(true)
        const featureFlagValue = await featureFlagCLI.getValue(
          Features.delegationTypesWithNotificationsEnabled,
          '',
          {
            id: userInfo?.profile?.nationalId || '',
            attributes: {},
          },
        )

        // Match the backend logic from filterByFeatureFlaggedDelegationTypes
        if (!featureFlagValue?.trim()) {
          // Empty value means no delegation types allowed
          setIsDelegationTypeEnabled(false)
        } else if (featureFlagValue.trim() === '*') {
          // All delegation types allowed
          setIsDelegationTypeEnabled(true)
        } else if (delegationType && delegationType.length > 0) {
          // Check if any of the actor's delegation types are allowed
          const allowedTypes = new Set(
            featureFlagValue.split(',').map((type) => type.trim()),
          )

          // Check each delegation type the actor has
          const hasAllowedType = delegationType.some((type) => {
            // Special handling for Custom and GeneralMandate delegation types
            // They are stored with a ":person" or ":company" suffix
            if (
              type === AuthDelegationType.Custom ||
              type === AuthDelegationType.GeneralMandate
            ) {
              const actorNationalId = userInfo?.profile?.nationalId

              if (!actorNationalId) {
                return false
              }

              const suffix = kennitala.isCompany(actorNationalId)
                ? ':company'
                : ':person'
              const typeWithSuffix = `${type}${suffix}`

              return allowedTypes.has(typeWithSuffix)
            } else {
              // For other delegation types, check directly
              return allowedTypes.has(type)
            }
          })

          setIsDelegationTypeEnabled(hasAllowedType)
        } else {
          // No delegation type specified for the actor
          setIsDelegationTypeEnabled(false)
        }

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

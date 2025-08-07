import * as kennitala from 'kennitala'
import { AuthDelegationType } from '@island.is/shared/types'

interface ParseDelegationTypeFeatureFlagValueParams {
  featureFlagValue: string | undefined
  delegationTypes: AuthDelegationType[] | undefined
  actorNationalId: string | undefined
}

/**
 * Parses the delegation type feature flag value and determines if the delegation type is enabled
 * @param params - The parameters for parsing
 * @returns boolean indicating if the delegation type is enabled
 */
export const parseDelegationTypeFeatureFlagValue = ({
  featureFlagValue,
  delegationTypes,
  actorNationalId,
}: ParseDelegationTypeFeatureFlagValueParams): boolean => {
  // Match the backend logic from filterByFeatureFlaggedDelegationTypes
  if (!featureFlagValue?.trim()) {
    // Empty value means no delegation types allowed
    return false
  }

  if (featureFlagValue.trim() === '*') {
    // All delegation types allowed
    return true
  }

  if (!delegationTypes || delegationTypes.length === 0) {
    // No delegation type specified for the actor
    return false
  }

  // Check if any of the actor's delegation types are allowed
  const allowedTypes = new Set(
    featureFlagValue.split(',').map((type) => type.trim()),
  )

  // Check each delegation type the actor has
  const hasAllowedType = delegationTypes.some((type) => {
    // Special handling for Custom and GeneralMandate delegation types
    // They are stored with a ":person" or ":company" suffix
    if (
      type === AuthDelegationType.Custom ||
      type === AuthDelegationType.GeneralMandate
    ) {
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

  return hasAllowedType
}

/**
 * Gets the allowed delegation types from a feature flag value
 * @param featureFlagValue - The feature flag value
 * @returns Set of allowed delegation types
 */
export const getAllowedDelegationTypes = (
  featureFlagValue: string | undefined,
): Set<string> | null => {
  if (!featureFlagValue?.trim()) {
    return new Set()
  }

  if (featureFlagValue.trim() === '*') {
    return null // null indicates all types are allowed
  }

  return new Set(featureFlagValue.split(',').map((type) => type.trim()))
}

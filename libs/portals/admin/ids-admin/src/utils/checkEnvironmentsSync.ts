import isEqual from 'lodash/isEqual'

import { DynamicEnvironmentResult } from '../types/dynamicEnvironmentResult'

/**
 * Checks if the given variables are in sync across the given environments.
 * @param environments
 * @param variables - The developer is responsible to provide the correct subset of variables.
 */
export const checkEnvironmentsSync = <T extends DynamicEnvironmentResult<T>>(
  environments: T[],
  variables: Array<keyof T>,
) => {
  const referenceEnvironment = environments[0]

  for (const variableName of variables) {
    const referenceValue = referenceEnvironment[variableName]

    for (let i = 1; i < environments.length; i++) {
      const currentEnvironment = environments[i]
      const currentValue = currentEnvironment[variableName]

      if (!isEqual(currentValue, referenceValue)) {
        return false
      }
    }
  }

  return true
}

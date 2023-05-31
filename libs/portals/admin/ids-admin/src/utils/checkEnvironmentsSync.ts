import { AuthAdminEnvironment } from '@island.is/api/schema'

type EnvironmentItem<T> = {
  [K in keyof T]: T[K]
} & {
  environment: AuthAdminEnvironment
}

/**
 * Checks if the given variables are in sync across the given environments.
 * @param environments
 * @param variables - The developer is responsible to provide the correct subset of variables.
 */
export const checkEnvironmentsSync = <T extends EnvironmentItem<T>>(
  environments: T[],
  variables: Array<keyof T>,
) => {
  const referenceEnvironment = environments[0]

  for (const variableName of variables) {
    const referenceValue = referenceEnvironment[variableName]

    for (let i = 1; i < environments.length; i++) {
      const currentEnvironment = environments[i]
      const currentValue = currentEnvironment[variableName]

      if (JSON.stringify(currentValue) !== JSON.stringify(referenceValue)) {
        return false
      }
    }
  }

  return true
}

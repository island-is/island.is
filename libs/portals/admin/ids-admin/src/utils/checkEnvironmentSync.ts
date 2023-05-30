import { AuthAdminEnvironment } from '@island.is/api/schema'

type EnvironmentItem<T> = {
  [K in keyof T]: T[K]
} & {
  environment: AuthAdminEnvironment
}

type CheckEnvironmentSync<T> = {
  environments: T[]
  variables: Array<keyof T>
  selectedEnvironment: T
}

/**
 * This function is used to check if the selected environment is in sync with the other environments.
 * It only checks the variables that are passed in the variables array.
 * @param environments
 * @param selectedEnvironment
 * @param variables - The developer is responsible to provide the correct subset of variables.
 */
export const checkEnvironmentSync = <T extends EnvironmentItem<T>>({
  environments,
  selectedEnvironment,
  variables,
}: CheckEnvironmentSync<T>) => {
  for (const variable of variables) {
    for (const env of environments) {
      if (
        JSON.stringify(env[variable]) !==
        JSON.stringify(selectedEnvironment[variable])
      ) {
        return false
      }
    }
  }

  return true
}

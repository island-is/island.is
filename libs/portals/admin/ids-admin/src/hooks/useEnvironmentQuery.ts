import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useSyncedQueryStringValueWithoutNavigation } from './useSyncedQueryStringValueWithoutNavigation'
import { DynamicEnvironmentResult } from '../types/dynamicEnvironmentResult'

/**
 * This hook is used to get the current environment from the URL query string,
 * or the first item in environments array if none query string is provided.
 * It also provides a function to update the environment manually with an update function.
 */
export const useEnvironmentQuery = <T extends DynamicEnvironmentResult<T>>(
  environments: Array<T>,
) => {
  const [searchParams] = useSearchParams()
  const env = searchParams.get('env') ?? ''
  const [environmentName, setEnvironmentName] = useState(env)

  const findEnvironment = (environment: string) =>
    environments.find((env) => env.environment === environment)

  const environment =
    findEnvironment(environmentName) ?? environments[environments.length - 1]

  useSyncedQueryStringValueWithoutNavigation(
    'env',
    environment.environment,
    true,
  )

  /**
   * This function is used to update the environment manually.
   * It both updates the environment name and the environment result.
   */
  const updateEnvironment = (env: AuthAdminEnvironment) => {
    const newEnvironmentResult = findEnvironment(env)

    if (!newEnvironmentResult) return

    setEnvironmentName(env)

    return newEnvironmentResult
  }

  return {
    environment,
    updateEnvironment,
  }
}

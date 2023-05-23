import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useSyncedQueryStringValueWithoutNavigation } from './useSyncedQueryStringValueWithoutNavigation'

type EnvironmentResult<T> = {
  [K in keyof T]: T[K]
} & {
  environment: AuthAdminEnvironment
}

/**
 * This hook is used to get the current environment from the URL query string,
 * or the first item in environments array if none query string is provided.
 * It also provides a function to update the environment manually with an update function.
 */
export const useEnvironment = <T extends EnvironmentResult<T>>(
  environments: Array<T>,
) => {
  const [searchParams] = useSearchParams()
  const env = searchParams.get('env') ?? ''
  const [environmentName, setEnvironmentName] = useState(env)

  const findEnvironment = (environment: string) =>
    environments.find((env) => env.environment === environment)

  const [prevEnvironments, setPrevEnvironments] = useState(environments)
  const [environmentResult, setEnvironmentResult] = useState(
    findEnvironment(environmentName) ?? environments[0],
  )

  useSyncedQueryStringValueWithoutNavigation(
    'env',
    environmentResult.environment,
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
    setEnvironmentResult(newEnvironmentResult)

    return newEnvironmentResult
  }

  if (prevEnvironments !== environments) {
    // Make sure to update the environment result if the environments array changes.
    setEnvironmentResult(findEnvironment(environmentName) ?? environments[0])
    setPrevEnvironments(environments)
  }

  return {
    environment: environmentResult,
    updateEnvironment,
  }
}

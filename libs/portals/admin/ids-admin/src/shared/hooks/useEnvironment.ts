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
 * @param environments
 */
export const useEnvironment = <T extends EnvironmentResult<T>>(
  environments: Array<T>,
) => {
  const [searchParams] = useSearchParams()
  const [environmentName, setEnvironmentName] = useState(
    searchParams.get('env') ?? '',
  )
  const [environmentResult, setEnvironmentResult] = useState(
    environments.find(({ environment }) => environment === environmentName) ??
      environments[0],
  )

  useSyncedQueryStringValueWithoutNavigation(
    'env',
    environmentResult.environment,
    true,
  )

  const getEnvironment = (environment: AuthAdminEnvironment) =>
    environments.find((env) => env.environment === environment)

  const updateEnvironment = (env: AuthAdminEnvironment) => {
    const newEnvironmentResult = getEnvironment(env)

    if (!newEnvironmentResult) return

    setEnvironmentName(env)
    setEnvironmentResult(newEnvironmentResult)

    return newEnvironmentResult
  }

  return {
    environment: environmentResult,
    updateEnvironment,
  }
}

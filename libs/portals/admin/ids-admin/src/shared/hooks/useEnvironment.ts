import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { AuthAdminEnvironment } from '@island.is/api/schema'

import { useSyncedQueryStringValueWithoutNavigation } from './useSyncedQueryStringValueWithoutNavigation'

type EnvironmentResult<T> = {
  [K in keyof T]: T[K]
} & {
  environment: AuthAdminEnvironment
}

export const useEnvironment = <T extends EnvironmentResult<T>>(
  environments: Array<T>,
) => {
  const [searchParams] = useSearchParams()
  const [environmentName, setEnvironmentName] = useState(
    searchParams.get('env') ?? '',
  )

  const [environment, setEnvironment] = useState(
    environments.find(({ environment }) => environment === environmentName) ??
      environments[0],
  )

  const updateEnvironmentName = (env: AuthAdminEnvironment) => {
    setEnvironmentName(env)
  }

  useSyncedQueryStringValueWithoutNavigation(
    'env',
    environment.environment,
    true,
  )

  const getEnvironment = (environment: AuthAdminEnvironment) =>
    environments.find((env) => env.environment === environment)

  const updateEnvironment = (env: AuthAdminEnvironment) => {
    const newSelectedPermission = getEnvironment(env)

    if (newSelectedPermission) {
      setEnvironmentName(env)
      setEnvironment(newSelectedPermission)
    }
  }

  return {
    environmentName,
    updateEnvironmentName,
    environment,
    updateEnvironment,
  }
}

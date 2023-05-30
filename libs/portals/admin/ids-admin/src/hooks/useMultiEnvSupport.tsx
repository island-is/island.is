import { useEffect, useState } from 'react'
import { useEnvironment } from '../context/EnvironmentContext'

export const useMultiEnvSupport = (shouldSupportMultiEnvOverride = true) => {
  const { availableEnvironments } = useEnvironment()
  const [shouldSupportMultiEnv, setShouldSupportMultiEnv] = useState(
    shouldSupportMultiEnvOverride,
  )

  useEffect(() => {
    // If the override is false, we don't need to check for multi env support
    if (!shouldSupportMultiEnvOverride) return

    setShouldSupportMultiEnv(availableEnvironments?.length > 1)
  }, [availableEnvironments])

  return shouldSupportMultiEnv
}

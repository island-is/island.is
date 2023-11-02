import { useEnvironment } from '../context/EnvironmentContext'

export const useMultiEnvSupport = (shouldSupportMultiEnvOverride = true) => {
  const { availableEnvironments } = useEnvironment()

  return shouldSupportMultiEnvOverride && availableEnvironments?.length > 1
}

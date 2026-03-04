import {
  environmentStore,
  useEnvironmentStore,
} from './stores/environment-store'

export { bundleId, isTestingApp, config } from './config-constants'
export type { EnvironmentId } from './config-constants'
import { config } from './config-constants'

export function useConfig() {
  const { environment } = useEnvironmentStore()
  return {
    ...config,
    ...environment,
  }
}

export function getConfig() {
  return {
    ...config,
    ...environmentStore.getState().environment,
  }
}

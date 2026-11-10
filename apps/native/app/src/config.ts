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

/** The testing app logs in to production with a client of its own. */
export function getClientId() {
  const { isTestingApp, id, idsClientId } = getConfig()
  return isTestingApp && id === 'prod'
    ? '@island.is/island.dev-appid'
    : idsClientId
}

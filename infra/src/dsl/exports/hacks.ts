import { ref, ServiceBuilder } from '../dsl'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../../apps/application-system/api/infra/application-system-api'

/**
 * This is where we do hacks, in order to do our best to support weird situations like circular dependencies, etc.
 * @param fullSetOfServices
 * @param habitat
 */
export function hacks(
  fullSetOfServices: ServiceBuilder<any>[],
  habitat: ServiceBuilder<any>[],
  dockerTag?: string,
) {
  const api = fullSetOfServices.find((s) => s.serviceDef.name === 'api')
  const applicationSystemAPI = fullSetOfServices.find(
    (s) => s.serviceDef.name === 'application-system-api',
  )
  if (api && applicationSystemAPI) {
    applicationSystemAPI.serviceDef.env[GRAPHQL_API_URL_ENV_VAR_NAME] = ref(
      (h) => `http://${h.svc(habitat.find((s) => s.name() === 'api')!)}`,
    )
  }
  if (dockerTag) {
    for (const serviceDef of fullSetOfServices) {
      if (!serviceDef.serviceDef.image) {
        serviceDef.serviceDef.image = `${serviceDef.serviceDef.name}:${dockerTag}`
      } else {
        serviceDef.serviceDef.image = `${serviceDef.serviceDef.image}:${dockerTag}`
      }
    }
  }
}

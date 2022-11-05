import { Service } from '../types/input-types'
import { GRAPHQL_API_URL_ENV_VAR_NAME } from '../../../../apps/application-system/api/infra/application-system-api'

export function featureSpecificServiceDef(featureSpecificServices: Service[]) {
  const hackForThatOneCircularDependency = () => {
    const isApiServicePresent = featureSpecificServices.some(
      (s) => s.serviceDef.name === 'api',
    )
    const applicationSystemAPI = featureSpecificServices.find(
      (s) => s.serviceDef.name === 'application-system-api',
    )
    if (isApiServicePresent && applicationSystemAPI) {
      applicationSystemAPI.serviceDef.env[GRAPHQL_API_URL_ENV_VAR_NAME] =
        'http://web-api'
    }
  }
  hackForThatOneCircularDependency()
}

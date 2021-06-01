import { NationalRegistryModuleConfig } from '@island.is/clients/national-registry-v2'
import { createXRoadAPIPath } from '@island.is/utils/api'
import { environment } from '../../../environments'

export const NationalRegistryConfig: NationalRegistryModuleConfig = {
  xRoadPath: createXRoadAPIPath(
    environment.nationalRegistry.xroad.basePath ?? '',
    environment.nationalRegistry.xroad.memberClass ?? '',
    environment.nationalRegistry.xroad.memberCode ?? '',
    environment.nationalRegistry.xroad.apiPath ?? '',
  ),
  xRoadClient: environment.nationalRegistry.xroad.clientId ?? '',
}

import { RskModuleConfig } from '@island.is/clients/rsk/v2'
import { createXRoadAPIPath } from '@island.is/utils/api'
import { Base64 } from 'js-base64'
import { environment } from '../../../environments'

export const RskConfig: RskModuleConfig = {
  xRoadPath: createXRoadAPIPath(
    environment.rsk.xroad.basePath,
    environment.rsk.xroad.memberClass,
    environment.rsk.xroad.memberCode,
    environment.rsk.xroad.apiPath,
  ),
  xRoadClient: environment.rsk.xroad.clientId,
  basicAuth: `${Base64.encode(
    `${environment.rsk.username}:${environment.rsk.password}`,
  )}`,
}

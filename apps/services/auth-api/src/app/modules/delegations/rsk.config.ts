import { RskModuleConfig } from '@island.is/clients/rsk/v2'
import { createXRoadAPIPath, XRoadMemberClass } from '@island.is/utils/api'
import { Base64 } from 'js-base64'

const XROAD_BASE_PATH = process.env.XROAD_BASE_PATH_WITH_ENV ?? ''
const XROAD_MEMBER_CLASS = XRoadMemberClass.GovernmentInstitution
const XROAD_MEMBER_CODE = process.env.XROAD_RSK_MEMBER_CODE ?? ''
const XROAD_API_PATH = process.env.XROAD_RSK_API_PATH ?? ''
const XROAD_CLIENT_ID = process.env.XROAD_RSK_CLIENT_ID ?? ''
const USERNAME = process.env.RSK_USERNAME ?? ''
const PASSWORD = process.env.RSK_PASSWORD ?? ''

export class RskConfig {
  static get(): RskModuleConfig {
    return <RskModuleConfig>{
      xRoadPath: createXRoadAPIPath(
        XROAD_BASE_PATH,
        XROAD_MEMBER_CLASS,
        XROAD_MEMBER_CODE,
        XROAD_API_PATH,
      ),
      xRoadClient: XROAD_CLIENT_ID,
      basicAuth: `${Base64.encode(`${USERNAME}:${PASSWORD}`)}`,
    }
  }
}

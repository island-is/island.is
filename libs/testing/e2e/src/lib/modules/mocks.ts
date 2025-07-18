import {
  XroadConf,
  XRoadEnvs,
  XroadSectionConfig,
} from '../../../../../../infra/src/dsl/xroad'
import { XRoadMemberClass } from '@island.is/shared/utils/server'

export const resetMocks = async () => {
  // Mocks are now handled by Mockoon CLI, so this is a no-op
  console.log('Mocks reset (no-op for Mockoon)')
}
export const addXroadMock = async <Conf extends XroadSectionConfig>(
  options:
    | {
        config: XroadConf<Conf>
        orgType?: XRoadMemberClass
        serviceMemberCode: XRoadEnvs<Conf>
        prefix: XRoadEnvs<Conf>
        apiPath: string
        response: unknown
        prefixType: 'base-path-with-env'
        method?: unknown
      }
    | {
        config: XroadConf<Conf>
        prefix: XRoadEnvs<Conf>
        response: unknown
        apiPath: string
        prefixType: 'only-base-path'
        method?: unknown
      },
) => {
  // Mocks are now handled by Mockoon CLI, so this is a no-op
  console.log(`Mock added (no-op for Mockoon): ${options.apiPath}`)
}

// NOTE: To run this locally, you'll need to portforward soffia and set
// the environment variable "SOFFIA_SOAP_URL" to https://localhost:8443
// kubectl port-forward svc/socat-soffia 8443:443 -n socat
import { Test, TestingModule } from '@nestjs/testing'
import {
  NationalRegistryModule,
  EinstaklingarApi,
} from '@island.is/clients/national-registry-v2'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import { LoggingModule } from '@island.is/logging'

describe('is.island.external.national', async () => {
  let client: EinstaklingarApi
  const XROAD_CLIENT = process.env.XROAD_CLIENT_ID!
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        LoggingModule,
        NationalRegistryModule.register({
          xRoadPath: createXRoadAPIPath(
            process.env.XROAD_BASE_PATH_WITH_ENV!,
            XRoadMemberClass.GovernmentInstitution,
            process.env.XROAD_TJODSKRA_MEMBER_CODE!,
            process.env.XROAD_TJODSKRA_API_PATH!,
          ),
          xRoadClient: XROAD_CLIENT,
        }),
      ],
    }).compile()
    client = await module.get<EinstaklingarApi>(EinstaklingarApi)
  })
  it('should get user correctly', async () => {
    const user = await client.einstaklingarGetEinstaklingur({
      id: '0101302989',
      xRoadClient: XROAD_CLIENT,
    })
    expect(user.fulltNafn).toEqual('Gervimaður Ameríka')
  })
  it('throws error if user is not found', async () => {
    await expect(
      client.einstaklingarGetEinstaklingur({
        id: '0123456789',
        xRoadClient: XROAD_CLIENT,
      }),
    ).rejects.toThrow(
      'user with nationalId 0123456789 not found in national Registry',
    )
  })
})

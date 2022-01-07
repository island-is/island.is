// NOTE: To run this locally, you'll need to portforward xroad service port and set
// the environment variable "XROAD_BASE_PATH_WITH_ENV=http://localhost:8088/r1/IS-TEST"
// Example:
//
// $ kubectl port-forward svc/socat-xroad 8088:80 -n socat &
// $ XROAD_BASE_PATH_WITH_ENV=http://localhost:8088/r1/IS-DEV XROAD_CLIENT_ID=IS-DEV/GOV/10000/island-is-client XROAD_TJODSKRA_API_PATH=/SKRA-Protected/Einstaklingar-v1 XROAD_TJODSKRA_MEMBER_CODE=10001 yarn nx run external-contracts-tests:external-test

import { Test, TestingModule } from '@nestjs/testing'
import {
  createXRoadAPIPath,
  XRoadMemberClass,
} from '@island.is/shared/utils/server'

import {
  NationalRegistryModule,
  EinstaklingarApi,
} from '@island.is/clients/national-registry-v2'

describe('is.island.external.national', () => {
  let client: EinstaklingarApi
  const XROAD_CLIENT = process.env.XROAD_CLIENT_ID!

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
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
    client = await module.get(EinstaklingarApi)
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

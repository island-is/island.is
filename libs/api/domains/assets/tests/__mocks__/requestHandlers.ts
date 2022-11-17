import { rest } from 'msw'
import type { User } from '@island.is/auth-nest-tools'

export const MOCK_NATIONAL_ID = '0'
export const MOCK_ASSET_ID = 'F123456'
export const MOCK_USER = {
  nationalId: '0',
  scope: ['test-scope-1'],
  client_id: 'test-client',
  delegationType: ['Custom'],
  actor: {
    nationalId: '1',
    scope: ['test-scope-2'],
  },
  authorization: '',
  client: '',
  ip: '',
  userAgent: '',
} as User

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_ASSET_PATH = '/api/v1'

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export class MockAssetsXRoadService {
  //constructor()
}

export const requestHandlers = [
  rest.get(url(`${XROAD_BASE_PATH}/fasteignir`), (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        propertyNumber: MOCK_ASSET_ID,
        defaultAddress: {
          displayShort: 'shortname',
          display: 'longname',
          propertyNumber: MOCK_ASSET_ID,
          municipality: 'municipality',
          postNumber: 101,
        },
        registeredOwners: {
          registeredOwners: [MOCK_USER],
        },
      }),
    )
  }),
]

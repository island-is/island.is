import { rest } from 'msw'
import type { User } from '@island.is/auth-nest-tools'

import ValidLicenseInfo from './validLicenseInfo.json'
import ValidPropertyInfo from './validPropertyInfo.json'

export const MOCK_NATIONAL_ID = '0'
export const MOCK_NATIONAL_ID_EXPIRED = '1'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_FIREARM_LICENSE_PATH =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1'

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(
    url(
      `${XROAD_FIREARM_LICENSE_PATH}/api/FirearmApplication/LicenseInfo/:nationalId`,
    ),
    (req, res, ctx) => {
      console.log(req.params.ssn)
      return res(ctx.status(200), ctx.json(ValidLicenseInfo))
    },
  ),
  rest.get(
    url(
      `${XROAD_FIREARM_LICENSE_PATH}/api/FirearmApplication/PropertyInfo/:nationalId`,
    ),
    (req, res, ctx) => {
      console.log(req.params.ssn)
      return res(ctx.status(200), ctx.json(ValidPropertyInfo))
    },
  ),
]

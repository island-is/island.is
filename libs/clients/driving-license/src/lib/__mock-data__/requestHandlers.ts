import type { User } from '@island.is/auth-nest-tools'
import { rest } from 'msw'
import { DriverLicenseDto } from '../../v5'

export enum MOCK_NATIONAL_IDS {
  'STUDENT' = '1',
  'TEACHER' = '2',
  'DEPRIVED' = '3',
  'NO_LICENSE' = '4',
  'MANY_CATEGORIES' = '5',
  'LICENSE_NO_PHOTO_NOR_SIGNATURE' = '6',
  'LICENSE_B_CATEGORY' = '7',
}

export const VALID_AUTH = 'Bearer OKIDOKE'
export const INVALID_AUTH = 'Bearer NOPEDEDOPE'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_DRIVING_LICENSE_PATH_V5 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v5/api/drivinglicense/v5'
export const XROAD_DRIVING_LICENSE_PATH_V1 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1/api'

const MOCK_HAS_QUALITY_PHOTO = {
  [MOCK_NATIONAL_IDS.STUDENT]: true,
  [MOCK_NATIONAL_IDS.TEACHER]: true,
  [MOCK_NATIONAL_IDS.DEPRIVED]: false,
  [MOCK_NATIONAL_IDS.NO_LICENSE]: false,
  [MOCK_NATIONAL_IDS.MANY_CATEGORIES]: true,
  [MOCK_NATIONAL_IDS.LICENSE_NO_PHOTO_NOR_SIGNATURE]: false,
  [MOCK_NATIONAL_IDS.LICENSE_B_CATEGORY]: true,
}

const MOCK_HAS_SIGNATURE = {
  [MOCK_NATIONAL_IDS.STUDENT]: true,
  [MOCK_NATIONAL_IDS.TEACHER]: true,
  [MOCK_NATIONAL_IDS.DEPRIVED]: false,
  [MOCK_NATIONAL_IDS.NO_LICENSE]: false,
  [MOCK_NATIONAL_IDS.MANY_CATEGORIES]: true,
  [MOCK_NATIONAL_IDS.LICENSE_NO_PHOTO_NOR_SIGNATURE]: false,
  [MOCK_NATIONAL_IDS.LICENSE_B_CATEGORY]: true,
}

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(
    url(`${XROAD_DRIVING_LICENSE_PATH_V1}/okuskirteini/:ssn/hasqualityphoto`),
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(
          MOCK_HAS_QUALITY_PHOTO[req.params.ssn as MOCK_NATIONAL_IDS] ? 1 : 0,
        ),
      )
    },
  ),
  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_PATH_V1}/okuskirteini/:ssn/hasqualitysignature`,
    ),
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json(
          MOCK_HAS_SIGNATURE[req.params.ssn as MOCK_NATIONAL_IDS] ? 1 : 0,
        ),
      )
    },
  ),
]

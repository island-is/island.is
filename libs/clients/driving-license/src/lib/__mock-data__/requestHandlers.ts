import { rest } from 'msw'
import { DriverLicenseDto } from '../../v5'

export enum MOCK_TOKEN {
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
  [MOCK_TOKEN.STUDENT]: true,
  [MOCK_TOKEN.TEACHER]: true,
  [MOCK_TOKEN.DEPRIVED]: false,
  [MOCK_TOKEN.NO_LICENSE]: false,
  [MOCK_TOKEN.MANY_CATEGORIES]: true,
  [MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE]: false,
  [MOCK_TOKEN.LICENSE_B_CATEGORY]: true,
}

const MOCK_HAS_SIGNATURE = {
  [MOCK_TOKEN.STUDENT]: true,
  [MOCK_TOKEN.TEACHER]: true,
  [MOCK_TOKEN.DEPRIVED]: false,
  [MOCK_TOKEN.NO_LICENSE]: false,
  [MOCK_TOKEN.MANY_CATEGORIES]: true,
  [MOCK_TOKEN.LICENSE_NO_PHOTO_NOR_SIGNATURE]: false,
  [MOCK_TOKEN.LICENSE_B_CATEGORY]: true,
}

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(/api\/drivinglicense\/v5\/hasqualityphoto/, (req, res, ctx) => {
    const jwttoken = req.headers.get('jwttoken')

    let mock_token: MOCK_TOKEN
    if (jwttoken) {
      mock_token = jwttoken as MOCK_TOKEN
    } else {
      return res(ctx.status(401))
    }

    return res(
      ctx.status(200),
      ctx.json(MOCK_HAS_QUALITY_PHOTO[mock_token] ? 1 : 0),
    )
  }),

  rest.get(/api\/drivinglicense\/v5\/hasqualitysignature/, (req, res, ctx) => {
    const jwttoken = req.headers.get('jwttoken')

    let mock_token: MOCK_TOKEN
    if (jwttoken) {
      mock_token = jwttoken as MOCK_TOKEN
    } else {
      return res(ctx.status(401))
    }

    return res(
      ctx.status(200),
      ctx.json(MOCK_HAS_SIGNATURE[mock_token] ? 1 : 0),
    )
  }),
]

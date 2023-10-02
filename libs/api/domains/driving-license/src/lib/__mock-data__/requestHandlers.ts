import { rest } from 'msw'
import ValidLicense from './validLicense.json'
import ExpiredLicense from './expiredLicense.json'
import LicenseWithDisqualification from './licenseWithDisqualification.json'
import Jurisdictions from './jurisdictions.json'
import DrivingAssessment from './drivingAssessment'
import FinishedSchool from './finishedSchool.json'
import NotFinishedSchool from './notFinishedSchool.json'
import CanApplyWithResultSuccess from './canApplyWithResultSuccess.json'
import CanApplyWithResultFail from './canApplyWithResultFail.json'
import Teachers from './teachers.json'
import ResidenceHistory from './residenceHistory.json'
import type { User } from '@island.is/auth-nest-tools'

export const MOCK_NATIONAL_ID = '0'
export const MOCK_NATIONAL_ID_EXPIRED = '1'
export const MOCK_NATIONAL_ID_TEACHER = '2'
export const MOCK_NATIONAL_ID_NO_ASSESSMENT = '9'
export const DISQUALIFIED_NATIONAL_IDS = [
  '0101302399',
  '0101302719',
  '0101305069',
  '0101303019',
]

type MockLicenseRaw =
  | typeof ValidLicense
  | typeof ExpiredLicense
  | typeof LicenseWithDisqualification

type MockLicense =
  | MockLicenseRaw
  | (Omit<MockLicenseRaw, 'svipting'> & {
      svipting: {
        dagsFra: Date | null
        dagsTil: Date | null
      }
    })

const nowDeltaMonths = (delta: number) => {
  const now = new Date()
  return new Date(new Date().setMonth(now.getMonth() + delta))
}

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
export const XROAD_DRIVING_LICENSE_PATH =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
export const XROAD_DRIVING_LICENSE_V2_PATH =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2'

// At the time of implementation, the v5 path is case sensitive depending on the environment
// and as such Okuskirteini and okuskirteini are considered paths
export const XROAD_DRIVING_LICENSE_V5_PATH =
  /\/r1\/IS-DEV\/GOV\/10005\/Logreglan-Protected\/[Oo]kuskirteini-v5/

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(
    url(`${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/embaetti`),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(Jurisdictions))
    },
  ),

  rest.get(
    url(`${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/okukennarar`),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(Teachers))
    },
  ),

  rest.get(
    url(`${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/:nationalId/all`),
    (req, res, ctx) => {
      let response: [MockLicense] =
        req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
          ? [ExpiredLicense]
          : [ValidLicense]

      if (DISQUALIFIED_NATIONAL_IDS.includes(req.params.nationalId)) {
        response = [LicenseWithDisqualification]
        switch (DISQUALIFIED_NATIONAL_IDS.indexOf(req.params.nationalId)) {
          // Currently active
          case 0:
            response[0].svipting.dagsFra = nowDeltaMonths(-6)
            response[0].svipting.dagsTil = nowDeltaMonths(6)
            break
          // Disqualification expired but still less than 12 months since expiry
          case 1:
            response[0].svipting.dagsFra = nowDeltaMonths(-13)
            response[0].svipting.dagsTil = nowDeltaMonths(-7)
            break
          // Disqualification expired more than 12 months ago
          case 2:
            response[0].svipting.dagsFra = nowDeltaMonths(-20)
            response[0].svipting.dagsTil = nowDeltaMonths(-13)
            break
          // Disqualification has unspecified end date
          default:
            response[0].svipting.dagsFra = nowDeltaMonths(-2)
            response[0].svipting.dagsTil = null
        }
      }
      return res(ctx.status(200), ctx.json(response))
    },
  ),
  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/hasteachingrights/:nationalId`,
    ),
    (req, res, ctx) => {
      const hasTeachingRights =
        req.params.nationalId === MOCK_NATIONAL_ID_TEACHER

      return res(ctx.status(200), ctx.json(hasTeachingRights ? 1 : 0))
    },
  ),

  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/saekjaakstursmat/:nationalId`,
    ),
    (req, res, ctx) => {
      const isFound = req.params.nationalId !== MOCK_NATIONAL_ID_NO_ASSESSMENT
      if (isFound) {
        return res(ctx.status(200), ctx.json(DrivingAssessment))
      } else {
        return res(ctx.status(404), ctx.text('error message from service'))
      }
    },
  ),

  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/:nationalId/finishedokugerdi`,
    ),
    (req, res, ctx) => {
      const isFound = req.params.nationalId !== MOCK_NATIONAL_ID_EXPIRED

      return res(
        ctx.status(200),
        ctx.json(isFound ? FinishedSchool : NotFinishedSchool),
      )
    },
  ),

  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_V2_PATH}/api/okuskirteini/:nationalId/canapplyfor/B/full`,
    ),
    (req, res, ctx) => {
      const canApply = req.params.nationalId === MOCK_NATIONAL_ID

      return res(
        ctx.status(200),
        ctx.json(canApply ? CanApplyWithResultSuccess : CanApplyWithResultFail),
      )
    },
  ),

  rest.get(
    url(
      `${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/:nationalId/canapplyfor/temporary`,
    ),
    (req, res, ctx) => {
      const canApply = req.params.nationalId === MOCK_NATIONAL_ID

      return res(
        ctx.status(200),
        ctx.json(canApply ? CanApplyWithResultSuccess : CanApplyWithResultFail),
      )
    },
  ),

  rest.post(
    url(`${XROAD_DRIVING_LICENSE_PATH}/api/okuskirteini/new/drivingassesment`),
    (req, res, ctx) => {
      const body = req.body as any
      const isSubmittedByTeacher =
        body?.kennitalaOkukennara === MOCK_NATIONAL_ID_TEACHER

      if (isSubmittedByTeacher) {
        return res(ctx.status(200), ctx.text(''))
      } else {
        return res(ctx.status(400), ctx.text('error message'))
      }
    },
  ),

  rest.post(
    url(`${XROAD_DRIVING_LICENSE_V2_PATH}/api/okuskirteini/applications/new/B`),
    (req, res, ctx) => {
      const body = req.body as any
      const canApply = body.personIdNumber !== MOCK_NATIONAL_ID_NO_ASSESSMENT

      if (canApply) {
        return res(ctx.status(200), ctx.text(''))
      } else {
        return res(ctx.status(400), ctx.text('error message'))
      }
    },
  ),

  rest.post(
    url(
      `${XROAD_DRIVING_LICENSE_V2_PATH}/api/okuskirteini/applications/new/temporary`,
    ),
    (req, res, ctx) => {
      const body = req.body as any
      const canApply = body.kennitala !== MOCK_NATIONAL_ID_NO_ASSESSMENT

      if (canApply) {
        return res(
          ctx.status(200),
          ctx.json({
            result: true,
            okuskirteiniId: 1,
            errorCode: null,
          }),
        )
      } else {
        return res(ctx.status(400), ctx.text('error message'))
      }
    },
  ),

  rest.get(
    url(`${XROAD_DRIVING_LICENSE_V2_PATH}/api/okuskirteini/:nationalId`),
    (req, res, ctx) => {
      const isExpired = req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
      const isDisqualified = DISQUALIFIED_NATIONAL_IDS.includes(
        req.params.nationalId,
      )
      return res(
        ctx.status(isExpired || isDisqualified ? 400 : 200),
        ctx.json(
          isExpired
            ? { message: 'Ökuskírteini er ekki í gildi' }
            : isDisqualified
            ? { detail: 'Einstaklingur er sviptur ökuréttindum' }
            : ValidLicense,
        ),
      )
    },
  ),

  // Ignore calls to this endpoint and mock response in get All Driving Licenses
  rest.get(
    new RegExp(
      XROAD_DRIVING_LICENSE_V5_PATH.source +
        /\/api\/drivinglicense\/v5\/deprivation/.source,
    ),
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          dateFrom: null,
          dateTo: null,
        }),
      )
    },
  ),

  rest.get(
    url(`${XROAD_DRIVING_LICENSE_PATH}/einstaklingar/:nationalId/buseta`),
    (req, res, ctx) => {
      const isExpired = req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
      return res(
        ctx.status(isExpired ? 400 : 200),
        ctx.json(isExpired ? undefined : ResidenceHistory),
      )
    },
  ),
]

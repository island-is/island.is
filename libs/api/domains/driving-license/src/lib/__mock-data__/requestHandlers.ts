import { rest } from 'msw'
import ValidLicense from './validLicense.json'
import ExpiredLicense from './expiredLicense.json'
import LicenseWithDisqualification from './licenseWithDisqualification.json'
import DrivingAssessment from './drivingAssessment'
import Teachers from './teachers.json'
import type { User } from '@island.is/auth-nest-tools'

export const MOCK_NATIONAL_ID = '0'
export const MOCK_NATIONAL_ID_EXPIRED = '1'
export const MOCK_NATIONAL_ID_TEACHER = '2'
export const MOCK_NATIONAL_ID_NO_ASSESSMENT = '9'

export const MOCK_TOKEN = '0'
export const MOCK_TOKEN_EXPIRED = '1'
export const MOCK_TOKEN_TEACHER = '2'
export const MOCK_TOKEN_NO_ASSESSMENT = '9'

export const DISQUALIFIED_NATIONAL_IDS = [
  '0101302399',
  '0101302719',
  '0101305069',
  '0101303019',
]

export const DISQUALIFIED_TOKENS = [
  'auth-token-disqualified-01',
  'auth-token-disqualified-02',
  'auth-token-disqualified-03',
  'auth-token-disqualified-04',
]

type MockLicenseRaw =
  | typeof ValidLicense
  | typeof ExpiredLicense
  | typeof LicenseWithDisqualification

type MockLicense =
  | MockLicenseRaw
  | (Omit<MockLicenseRaw, 'deprivation'> & {
      deprivation: {
        dateTo: Date | null
        dateFrom: Date | null
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
  authorization: MOCK_TOKEN,
  client: '',
  ip: '',
  userAgent: '',
} as User

export const requestHandlers = [
  rest.get(/api\/drivinglicense\/v4\/\d+$/, (req, res, ctx) => {
    // Possibly questionable given weak matching, should not be a problem in practice
    const nationalId = req.url.pathname.split('/').pop() ?? ''

    const isExpired = nationalId === MOCK_NATIONAL_ID_EXPIRED
    const isDisqualified = DISQUALIFIED_NATIONAL_IDS.includes(nationalId)
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
  }),

  rest.get(/api\/drivinglicense\/v4\/\d+\/all$/, (req, res, ctx) => {
    // Possibly questionable given weak matching, should not be a problem in practice
    const nationalId = req.url.pathname.split('/').reverse()?.[1] ?? ''

    let response: [MockLicense] =
      nationalId === MOCK_NATIONAL_ID_EXPIRED
        ? [ExpiredLicense]
        : [ValidLicense]

    if (DISQUALIFIED_NATIONAL_IDS.includes(nationalId)) {
      response = [LicenseWithDisqualification]
      switch (DISQUALIFIED_NATIONAL_IDS.indexOf(nationalId)) {
        // Currently active
        case 0:
          response[0].deprivation.dateFrom = nowDeltaMonths(-6)
          response[0].deprivation.dateTo = nowDeltaMonths(6)
          break
        // Disqualification expired but still less than 12 months since expiry
        case 1:
          response[0].deprivation.dateFrom = nowDeltaMonths(-13)
          response[0].deprivation.dateTo = nowDeltaMonths(-7)
          break
        // Disqualification expired more than 12 months ago
        case 2:
          response[0].deprivation.dateFrom = nowDeltaMonths(-20)
          response[0].deprivation.dateTo = nowDeltaMonths(-13)
          break
        // Disqualification has unspecified end date
        default:
          response[0].deprivation.dateFrom = nowDeltaMonths(-2)
          response[0].deprivation.dateTo = null
      }
    }
    return res(ctx.status(200), ctx.json(response))
  }),

  rest.post(/api\/drivinglicense\/v5\/drivingassessment/, (req, res, ctx) => {
    const isTeacher =
      (req.body as { instructorSSN: string }).instructorSSN ===
      MOCK_NATIONAL_ID_TEACHER
    return res(ctx.status(isTeacher ? 200 : 400))
  }),

  rest.get(/api\/drivinglicense\/v5\/drivingassessment/, (req, res, ctx) => {
    const isFound = req.headers.get('jwttoken') !== MOCK_TOKEN_NO_ASSESSMENT
    if (isFound) {
      return res(ctx.status(200), ctx.json(DrivingAssessment))
    } else {
      return res(ctx.status(404), ctx.text('error message from service'))
    }
  }),

  rest.get(
    /api\/drivinglicense\/v5\/hasfinisheddrivingschool3/,
    (req, res, ctx) => {
      const isFound = req.headers.get('jwttoken') !== MOCK_TOKEN_EXPIRED
      return res(
        ctx.status(200),
        ctx.json({ hasFinishedDrivingSchool3: isFound }),
      )
    },
  ),

  rest.get(/api\/drivinglicense\/v5\/canapplyfor\/B\/full/, (req, res, ctx) => {
    const canApply = req.headers.get('jwttoken') === MOCK_TOKEN
    return res(
      ctx.status(200),
      ctx.json({ result: canApply, errorCode: canApply ? '' : 'SOME REASON' }),
    )
  }),

  // Ignore calls to this endpoint and mock response in get All Driving Licenses
  rest.get(/\/api\/drivinglicense\/v5\/deprivation/, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        dateFrom: null,
        dateTo: null,
      }),
    )
  }),

  rest.get(
    /api\/drivinglicense\/v5\/canapplyfor\/temporary/,
    (req, res, ctx) => {
      const canApply = req.headers.get('jwttoken') === MOCK_TOKEN
      return res(
        ctx.status(200),
        ctx.json({
          result: canApply,
          errorCode: canApply ? '' : 'SOME REASON',
        }),
      )
    },
  ),

  rest.get(/api\/drivinglicense\/v5\/hasteachingrights/, (req, res, ctx) => {
    let teachingRights = 0

    const token = req.headers.get('jwttoken')
    if (token === MOCK_TOKEN_TEACHER) {
      teachingRights = 1
    }

    return res(ctx.status(200), ctx.json(teachingRights))
  }),

  rest.get(/api\/drivinglicense\/v4\/drivinginstructors/, (_req, res, ctx) => {
    return res(ctx.status(200), ctx.json(Teachers))
  }),

  rest.post(
    /api\/drivinglicense\/v5\/applications\/new\/B/,
    (req, res, ctx) => {
      const hasAssessment =
        (req.body as { personIdNumber: string }).personIdNumber !==
        MOCK_NATIONAL_ID_NO_ASSESSMENT
      const newLicenseNumber = 1
      return res(
        ctx.status(hasAssessment ? 200 : 400),
        ctx.json(newLicenseNumber),
      )
    },
  ),

  rest.post(
    /api\/drivinglicense\/v5\/applications\/new\/temporary/,
    (req, res, ctx) => {
      const token = req.headers.get('jwttoken')
      const canApply = token !== MOCK_TOKEN_NO_ASSESSMENT

      if (canApply) {
        return res(
          ctx.status(200),
          ctx.json({
            result: true,
            driverLicenseId: 1,
            errorCode: null,
          }),
        )
      } else {
        return res(ctx.status(400), ctx.text('error message'))
      }
    },
  ),
]

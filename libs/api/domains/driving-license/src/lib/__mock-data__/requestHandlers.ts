import { rest } from 'msw'
import ValidLicense from './validLicense.json'
import ExpiredLicense from './expiredLicense.json'
import Juristictions from './juristictions.json'
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
export const MOCK_USER = {
  nationalId: '0',
  scope: ['test-scope-1'],
  client_id: 'test-client',
  actor: {
    nationalId: '1',
    delegationType: 'Custom',
    scope: ['test-scope-2'],
  },
  authorization: '',
  client: '',
  ip: '',
  userAgent: '',
} as User

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const DRIVING_LICENSE_XROAD_PATH = 'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
export const DRIVING_LICENSE_XROAD_PATH_V2 = 'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2'

const url = (path: string) => {
  return new URL(path, XROAD_BASE_PATH).toString()
}

export const requestHandlers = [
  rest.get(
    url(`${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/embaetti`),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(Juristictions))
    },
  ),

  rest.get(
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/okukennarar`,
    ),
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(Teachers))
    },
  ),

  rest.get(
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/:nationalId/all`,
    ),
    (req, res, ctx) => {
      const response =
        req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
          ? [ExpiredLicense]
          : [ValidLicense]
      return res(ctx.status(200), ctx.json(response))
    },
  ),
  rest.get(
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/hasteachingrights/:nationalId`,
    ),
    (req, res, ctx) => {
      const hasTeachingRights =
        req.params.nationalId === MOCK_NATIONAL_ID_TEACHER

      return res(ctx.status(200), ctx.json(hasTeachingRights ? 1 : 0))
    },
  ),

  rest.get(
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/saekjaakstursmat/:nationalId`,
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
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/:nationalId/finishedokugerdi`,
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
      `${DRIVING_LICENSE_XROAD_PATH_V2}/api/okuskirteini/:nationalId/canapplyfor/B/full`,
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
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/:nationalId/canapplyfor/temporary`,
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
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/api/okuskirteini/new/drivingassesment`,
    ),
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
    url(
      `${DRIVING_LICENSE_XROAD_PATH_V2}/api/okuskirteini/applications/new/B`,
    ),
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
      `${DRIVING_LICENSE_XROAD_PATH_V2}/api/okuskirteini/applications/new/temporary`,
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
    url(
      `${DRIVING_LICENSE_XROAD_PATH_V2}/api/okuskirteini/:nationalId`,
    ),
    (req, res, ctx) => {
      const isExpired = req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
      return res(
        ctx.status(isExpired ? 400 : 200),
        ctx.json(
          isExpired
            ? { message: 'Ökuskírteini er ekki í gildi' }
            : ValidLicense,
        ),
      )
    },
  ),

  rest.get(
    url(
      `${DRIVING_LICENSE_XROAD_PATH}/einstaklingar/:nationalId/buseta`,
    ),
    (req, res, ctx) => {
      const isExpired = req.params.nationalId === MOCK_NATIONAL_ID_EXPIRED
      return res(
        ctx.status(isExpired ? 400 : 200),
        ctx.json(isExpired ? undefined : ResidenceHistory),
      )
    },
  ),
]

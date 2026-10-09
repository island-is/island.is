import { rest } from 'msw'

export enum MOCK_TOKEN {
  'STUDENT' = '1',
  'TEACHER' = '2',
  'DEPRIVED' = '3',
  'NO_LICENSE' = '4',
  'MANY_CATEGORIES' = '5',
  'LICENSE_NO_PHOTO_NOR_SIGNATURE' = '6',
  'LICENSE_B_CATEGORY' = '7',
}

// Body of the most recent POST to the v5 NewCategory (B-full) endpoint, as the
// server actually received it. Lets tests assert which keys were serialized —
// notably that `undefined` biometric IDs are omitted rather than sent as null.
// Held on an object (not `export let`) so the mutation is visible to importers
// regardless of module interop.
export const lastNewCategoryRequest: {
  body?: Record<string, unknown>
} = {}

// Headers and body of the most recent POST to the v6 temporary
// `withhealthdeclaration` endpoint. v6 identifies the caller from a `jwttoken`
// HEADER that the OpenAPI document does not declare, so the header is injected
// by a fetch wrapper in `apiConfiguration.ts` rather than by the generated
// client — meaning nothing above the fetch layer can verify it. This capture is
// what makes that wrapper testable.
export const lastV6TemporaryRequest: {
  headers?: Record<string, string | null>
  body?: Record<string, unknown>
} = {}

// Same capture for the v6 BE submit. BE is the one write this migration moves
// that is live in production with no feature flag, and its v6 model was
// reshaped (`userId` and `healthDeclarationModel` dropped, `healthDeclaration`
// added and required). This lets a test pin the exact keys that reach RLS.
export const lastV6BeRequest: {
  headers?: Record<string, string | null>
  body?: Record<string, unknown>
} = {}

// Same capture for the v6 65+ submit, whose model gained a required
// `healthDeclaration` that the 65+ flow has no answers for.
export const lastV6Renewal65Request: {
  body?: Record<string, unknown>
} = {}

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

export const requestHandlers = [
  rest.post(
    /api\/applications\/v6\/temporarywithhealthdeclaration/,
    async (req, res, ctx) => {
      lastV6TemporaryRequest.headers = {
        jwttoken: req.headers.get('jwttoken'),
        authorization: req.headers.get('authorization'),
        'x-road-client': req.headers.get('X-Road-Client'),
        secret: req.headers.get('SECRET'),
      }
      lastV6TemporaryRequest.body = await req.json()

      // RLS returns the new application's guid on success (under a field the
      // generated DTO drops); the wrapper reads it from the raw body.
      return res(
        ctx.status(200),
        ctx.json({
          result: true,
          driverLicenseId: 7,
          guid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        }),
      )
    },
  ),
  // Captures the serialized body so tests can assert on the exact keys that
  // reach RLS — see `lastNewCategoryRequest` above. Stays on the v5 path
  // because the B-full/B-temp submits deliberately remain on v5 (see the
  // comments on postCreateDrivingLicenseFull / ...Temporary in the service).
  rest.post(
    /api\/drivinglicense\/v5\/applications\/new\//,
    async (req, res, ctx) => {
      lastNewCategoryRequest.body = await req.json()
      return res(ctx.status(200), ctx.json(1))
    },
  ),

  rest.post(/api\/applications\/v6\/applyfor\/be$/, async (req, res, ctx) => {
    lastV6BeRequest.headers = {
      jwttoken: req.headers.get('jwttoken'),
      authorization: req.headers.get('authorization'),
    }
    lastV6BeRequest.body = await req.json()
    return res(
      ctx.status(200),
      ctx.json({
        category: 'BE',
        result: true,
        applicationGuid: 'be-guid-0001',
      }),
    )
  }),

  // v6 resolves the caller from the `jwttoken` header that apiConfiguration.ts
  // injects; without it RLS cannot tell who is applying, so answer 401 and let
  // the wire, not just the wrapper, prove the header was sent.
  rest.get(/api\/imagecontroller\/v6\/hasqualityphoto$/, (req, res, ctx) => {
    const jwttoken = req.headers.get('jwttoken')
    if (!jwttoken) {
      return res(ctx.status(401))
    }

    return res(
      ctx.status(200),
      ctx.json(MOCK_HAS_QUALITY_PHOTO[jwttoken as MOCK_TOKEN] ? 1 : 0),
    )
  }),

  rest.get(
    /api\/imagecontroller\/v6\/hasqualitysignature$/,
    (req, res, ctx) => {
      const jwttoken = req.headers.get('jwttoken')
      if (!jwttoken) {
        return res(ctx.status(401))
      }

      return res(
        ctx.status(200),
        ctx.json(MOCK_HAS_SIGNATURE[jwttoken as MOCK_TOKEN] ? 1 : 0),
      )
    },
  ),

  // Same 401 guard as the image handlers above: a renewal submit that reaches
  // RLS without `jwttoken` has no applicant.
  rest.post(
    /api\/applications\/v6\/applyfor\/renewal65/,
    async (req, res, ctx) => {
      if (!req.headers.get('jwttoken')) {
        return res(ctx.status(401))
      }
      lastV6Renewal65Request.body = await req.json()
      return res(
        ctx.status(200),
        ctx.json({
          category: 'B',
          result: true,
          applicationGuid: 'renewal65-guid-0001',
        }),
      )
    },
  ),
]

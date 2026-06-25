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

export const VALID_AUTH = 'Bearer OKIDOKE'
export const INVALID_AUTH = 'Bearer NOPEDEDOPE'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_DRIVING_LICENSE_PATH_V6 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v6/api/drivinglicense/v6'
export const XROAD_DRIVING_LICENSE_PATH_V1 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1/api'

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

  // v6 identity travels in the `jwttoken` header (see apiConfiguration.ts); this
  // handler does not need to inspect it, so it just returns success. Per-person
  // quality-photo/signature scenarios are covered by spying on the v6 ImageApi
  // directly in the service spec.
  rest.post(/api\/applications\/v6\/applyfor\/renewal65/, (_req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        category: 'B',
        result: true,
      }),
    )
  }),
]

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

export const VALID_AUTH = 'Bearer OKIDOKE'
export const INVALID_AUTH = 'Bearer NOPEDEDOPE'

export const XROAD_BASE_PATH = 'http://localhost:8081'
export const XROAD_DRIVING_LICENSE_PATH_V6 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v6/api/drivinglicense/v6'
export const XROAD_DRIVING_LICENSE_PATH_V1 =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1/api'

export const requestHandlers = [
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

  // v6 derives the caller's identity from the forwarded X-Road end-user token,
  // so the request no longer carries a jwttoken header — the handler just
  // returns success. Per-person quality-photo/signature scenarios are now
  // covered by spying on the v6 ImageApi directly in the service spec.
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

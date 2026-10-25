import { z } from 'zod'

import {
  GOOGLE_PAY_ROOT_KEYS_URLS,
  GooglePayEnvironment,
} from './googlePay.constants'
import type { GooglePayRootSigningKey } from './googlePayToken'

const FETCH_TIMEOUT_MS = 5_000

// Used when Google's response carries no max-age. Google rotates root keys
// with weeks of overlap, so an hour is conservative.
const DEFAULT_MAX_AGE_MS = 60 * 60 * 1000

const RootKeysResponseSchema = z.object({
  keys: z.array(
    z.object({
      keyValue: z.string(),
      protocolVersion: z.string(),
      keyExpiration: z.string().optional(),
    }),
  ),
})

const maxAgeMsFromCacheControl = (cacheControl: string | null): number => {
  const match = cacheControl?.match(/(?:^|,)\s*max-age=(\d+)/i)
  return match ? Number(match[1]) * 1000 : DEFAULT_MAX_AGE_MS
}

/**
 * Fetches Google's root signing keys for the environment. The caller caches
 * them for `maxAgeMs`, Google's cache lifetime for the response; which keys
 * are current is decided per token by verifyAndDecryptGooglePayToken.
 */
export const fetchGooglePayRootKeys = async (
  environment: GooglePayEnvironment,
): Promise<{ keys: GooglePayRootSigningKey[]; maxAgeMs: number }> => {
  const response = await fetch(GOOGLE_PAY_ROOT_KEYS_URLS[environment], {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  })
  if (!response.ok) {
    throw new Error(
      `Google Pay root keys [stage=fetch] HTTP ${response.status} from ${environment}`,
    )
  }
  const result = RootKeysResponseSchema.safeParse(await response.json())
  if (!result.success) {
    throw new Error('Google Pay root keys [stage=parse] unexpected shape')
  }
  return {
    keys: result.data.keys,
    maxAgeMs: maxAgeMsFromCacheControl(response.headers.get('cache-control')),
  }
}

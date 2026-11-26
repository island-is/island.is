export type ApiKeyState = 'active' | 'revoked' | 'expired'

export const getApiKeyState = (
  apiKey: { revokedAt?: string | null; expiresAt?: string | null },
  now: Date = new Date(),
): ApiKeyState => {
  if (apiKey.revokedAt) {
    return 'revoked'
  }
  if (apiKey.expiresAt && new Date(apiKey.expiresAt) <= now) {
    return 'expired'
  }
  return 'active'
}

export const NO_EXPIRY = 'none'
export const VALIDITY_OPTIONS = [NO_EXPIRY, 3, 6, 12, 24] as const
export type Validity = typeof VALIDITY_OPTIONS[number]
export const DEFAULT_VALIDITY: Validity = NO_EXPIRY

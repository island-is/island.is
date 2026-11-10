import { DirectorateOfEqualityApiKey } from '../mocks/types'

export type ApiKeyState = 'active' | 'revoked' | 'expired'

export const getApiKeyState = (
  apiKey: Pick<DirectorateOfEqualityApiKey, 'revokedAt' | 'expiresAt'>,
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

export const VALIDITY_MONTHS = [3, 6, 12, 24] as const
export type ValidityMonths = typeof VALIDITY_MONTHS[number]
export const DEFAULT_VALIDITY_MONTHS: ValidityMonths = 12

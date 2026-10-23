/**
 * Normalizes a sender id (kennitala) by stripping all non-digit characters,
 * e.g. '550169-2829' -> '5501692829'.
 */
export const normalizeKennitala = (senderId: string): string =>
  senderId.replace(/\D/g, '')

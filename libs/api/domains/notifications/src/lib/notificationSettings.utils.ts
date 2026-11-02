export const normalizeSenderId = (senderId: string): string =>
  senderId.replace(/\D/g, '')

/** Matches the sender id validation user-profile applies */
export const isValidSenderId = (normalizedSenderId: string): boolean =>
  /^\d{10}$/.test(normalizedSenderId)

export const toCategoryKey = (senderId: string, category: string): string =>
  `${normalizeSenderId(senderId)}-${category}`

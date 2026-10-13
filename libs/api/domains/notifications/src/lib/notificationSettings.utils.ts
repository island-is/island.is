export const normalizeSenderId = (senderId: string): string =>
  senderId.replace(/\D/g, '')

export const toCategoryKey = (senderId: string, category: string): string =>
  `${normalizeSenderId(senderId)}-${category}`

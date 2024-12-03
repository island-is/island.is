export const cleanPhone = (phoneNumber: string) =>
  phoneNumber
    .replace(/\D/g, '')
    .replace(/^00354/, '')
    .replace(/^354/, '')

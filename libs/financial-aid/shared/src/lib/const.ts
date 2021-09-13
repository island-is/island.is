export const COOKIE_EXPIRES_IN_SECONDS = 4 * 60 * 60
export const COOKIE_EXPIRES_IN_MILLISECONDS = COOKIE_EXPIRES_IN_SECONDS * 1000

export const CSRF_COOKIE_NAME = 'financial-aid.csrf'

export const ACCESS_TOKEN_COOKIE_NAME = 'financial-aid.token'

export const AllowedFakeUsers = [
  '0000000000', // User with no current application
  '0000000001', // User with an application which is in progress
  '0000000002', // Veita user
  '0000000003', // User with an application which needs data
]

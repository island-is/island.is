export const COOKIE_EXPIRES_IN_SECONDS = 4 * 60 * 60
export const COOKIE_EXPIRES_IN_MILLISECONDS = COOKIE_EXPIRES_IN_SECONDS * 1000

export const CSRF_COOKIE_NAME = 'financial-aid.csrf'

export const ACCESS_TOKEN_COOKIE_NAME = 'financial-aid.token'

export const IDENTITY_SERVER_SESSION_TOKEN_COOKIE_NAME =
  'next-auth.session-token'

export const AllowedFakeUsers = [
  '0000000000', // User with no current application
  '0000000001', // User with an application which is in progress
  '0000000002', // Veita user
  '0000000003', // User with an application which needs data
]

export const Routes = {
  application: '/umsokn',
  status: '/stada',
  statusPage: (id: string) => `/stada/${id}`,
  statusFileUpload: (id: string) => `/stada/${id}/gogn`,
  statusFileUploadSuccess: (id: string) => `/stada/${id}/gogn/send`,
  statusFileUploadFailure: (id: string) => `/stada/${id}/gogn/villa`,
  apiLoginRouteForFake: (id: string) =>
    id
      ? `/api/auth/login?applicationId=${id}&nationalId=`
      : '/api/auth/login?nationalId=',
  apiLoginRouteForRealUsers: (id: string) =>
    id ? `/api/auth/login?applicationId=${id}` : '/api/auth/login',
  filesPage: '/gogn',
}

export const months = [
  'janúar',
  'febrúar',
  'mars',
  'apríl',
  'maí',
  'júní',
  'júlí',
  'ágúst',
  'september',
  'október',
  'nóvember',
  'desember',
]

export const getMonth = (month: number) => {
  return months[month]
}

export const nextMonth = (new Date().getMonth() + 1) % 12

export const getNextPeriod = {
  month: getMonth(nextMonth),
  year:
    nextMonth === 0 ? new Date().getFullYear() + 1 : new Date().getFullYear(),
}

export const apiBasePath = 'api'

export const signOutUrl = (window: Window, idToken: string) =>
  `${window.location.origin}/api/auth/logout?id_token=${idToken}`

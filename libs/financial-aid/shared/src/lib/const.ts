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
  filesPage: (hasIncome?: boolean) =>
    `/umsokn/${hasIncome ? 'skattagogn' : 'gogn'}`,
  newCases: '/nymal',
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

export const apiBasePath = 'api/financial-aid'

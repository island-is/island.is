import cookies from 'next-cookies'

const CSRF_COOKIE_NAME = 'skilavottord.csrf'

type CookieContext = { req?: { headers: { cookie?: string } } }

export type Role =
  | 'admin'
  | 'developer'
  | 'recyclingPartner'
  | 'recyclingFund'
  | 'citizen'

type Page =
  | 'myCars'
  | 'recycleVehicle'
  | 'deregisterVehicle'
  | 'recycledVehicles'
  | 'recyclingCompanies'

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[CSRF_COOKIE_NAME]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}

export const hasPermission = (page: Page, role: Role) => {
  if (role === 'admin' || role === 'developer') return true

  const permittedRoutes = {
    recyclingPartner: ['deregisterVehicle', 'companyInfo'],
    citizen: ['myCars', 'recycleVehicle'],
    fund: ['recycledVehicles', 'recyclingCompanies'],
  }

  return permittedRoutes[role].includes(page)
}

export const AUTH_URL = {
  citizen: '/api/auth/citizen',
  recyclingPartner: '/api/auth/company',
}

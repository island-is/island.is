import cookies from 'next-cookies'

import { Role } from '@island.is/skilavottord-web/graphql/schema'

const CSRF_COOKIE_NAME = 'skilavottord.csrf'

type CookieContext = { req?: { headers: { cookie?: string } } }

type Page =
  | 'myCars'
  | 'recycleVehicle'
  | 'deregisterVehicle'
  | 'recycledVehicles'
  | 'recyclingCompanies'
  | 'accessControl'

export const getCsrfToken = (ctx: CookieContext) => {
  return cookies(ctx || {})[CSRF_COOKIE_NAME]
}

export const isAuthenticated = (ctx: CookieContext) => {
  return Boolean(getCsrfToken(ctx))
}

export const isDeveloper = (role: Role) => role === Role.developer

export const hasPermission = (page: Page, role: Role) => {
  if (!role) return false

  if (role === Role.developer) return true

  const permittedRoutes = {
    recyclingCompany: ['deregisterVehicle', 'companyInfo'],
    citizen: ['myCars', 'recycleVehicle'],
    recyclingFund: ['recycledVehicles', 'recyclingCompanies'], // 'accessControl'
  }

  return permittedRoutes[role].includes(page)
}

export const AUTH_URL = {
  citizen: '/api/auth/citizen',
  recyclingPartner: '/api/auth/company',
}

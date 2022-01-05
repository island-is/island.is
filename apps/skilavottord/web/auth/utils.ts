import { Role } from '@island.is/skilavottord-web/graphql/schema'

type Page =
  | 'myCars'
  | 'recycleVehicle'
  | 'deregisterVehicle'
  | 'recycledVehicles'
  | 'recyclingCompanies'
  | 'accessControl'

export const isDeveloper = (role: Role) => role === Role.developer

export const hasPermission = (page: Page, role: Role) => {
  if (!role) return false

  if (role === Role.developer) return true

  const permittedRoutes = {
    recyclingCompany: [
      'deregisterVehicle',
      'companyInfo',
      'myCars',
      'recycleVehicle',
    ],
    citizen: ['myCars', 'recycleVehicle'],
    recyclingFund: [
      'recycledVehicles',
      'recyclingCompanies',
      'accessControl',
      'myCars',
      'recycleVehicle',
    ],
  }

  return permittedRoutes[role].includes(page)
}

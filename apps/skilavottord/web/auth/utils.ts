import { Role } from '@island.is/skilavottord-web/graphql/schema'

type Page =
  | 'myCars'
  | 'recycleVehicle'
  | 'deregisterVehicle'
  | 'recycledVehicles'
  | 'recyclingCompanies'
  | 'accessControl'
  | 'accessControlCompany'
  | 'companyInfo'
  | 'deregisterVehicleKM'

export const isDeveloper = (role: Role) => role === Role.developer

export const hasPermission = (page: Page, role: Role) => {
  if (!role) return false

  if (role === Role.developer) return true

  const permittedRoutes = {
    recyclingCompany: [
      'deregisterVehicle',
      'companyInfo',
      'deregisterVehicleKM',
    ],
    recyclingCompanyAdmin: [
      'deregisterVehicle',
      'companyInfo',
      'accessControlCompany',
      'deregisterVehicleKM',
    ],
    citizen: ['myCars', 'recycleVehicle'],
    recyclingFund: ['recycledVehicles', 'recyclingCompanies', 'accessControl'],
  }

  return permittedRoutes[role].includes(page)
}

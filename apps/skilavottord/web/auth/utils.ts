import { Role } from '../graphql/schema'

export type Page =
  | 'myCars'
  | 'recycleVehicle'
  | 'deregisterVehicle'
  | 'recycledVehicles'
  | 'recyclingCompanies'
  | 'accessControl'
  | 'accessControlCompany'
  | 'companyInfo'
  | 'municipalities'

export const hasDeveloperRole = (role: Role | undefined) =>
  role === Role.developer

export const hasMunicipalityRole = (role: Role | undefined) =>
  role === Role.municipality

export const hasRecyclingFundRole = (role: Role | undefined) =>
  role === Role.recyclingFund

export const hasPermission = (page: Page, role: Role) => {
  if (!role) return false

  if (role === Role.developer) return true

  const permittedRoutes = {
    recyclingCompany: ['deregisterVehicle', 'companyInfo'],
    recyclingCompanyAdmin: [
      'deregisterVehicle',
      'companyInfo',
      'accessControlCompany',
    ],
    citizen: ['myCars', 'recycleVehicle'],
    recyclingFund: [
      'recycledVehicles',
      'recyclingCompanies',
      'accessControl',
      'municipalities',
    ],
    municipality: ['recycledVehicles', 'recyclingCompanies', 'accessControl'],
  }

  return permittedRoutes[role].includes(page)
}

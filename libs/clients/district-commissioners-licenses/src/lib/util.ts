import { OrganizationSlugType } from '@island.is/shared/constants'
import { DistrictCommissionersLicenseStatus } from './districtCommissionersLicenses.types'

export const mapStatusToLiteral = (
  status: string,
): DistrictCommissionersLicenseStatus => {
  if (status === 'VALID') return 'valid'
  if (status === 'EXPIRED') return 'expired'
  if (status === 'INPROGRESS') return 'in-progress'
  if (status === 'REVOKED') return 'revoked'

  return 'unknown'
}

export const mapIssuerIdToOrganizationSlugType = (
  id: string,
): OrganizationSlugType => {
  switch (id) {
    case '41':
      return 'syslumadurinn-a-hoefudborgarsvaedinu'
    case '42':
      return 'syslumadurinn-a-vesturlandi'
    case '43':
      return 'syslumadurinn-a-vestfjordum'
    case '44':
      return 'syslumadurinn-a-nordurlandi-vestra'
    case '45':
      return 'syslumadurinn-a-nordurlandi-eystra'
    case '46':
      return 'syslumadurinn-a-austurlandi'
    case '47':
      return 'syslumadurinn-a-sudurlandi'
    case '48':
      return 'syslumadurinn-a-sudurnesjum'
    case '49':
      return 'syslumadurinn-i-vestmannaeyjum'
    default:
      return 'syslumenn'
  }
}

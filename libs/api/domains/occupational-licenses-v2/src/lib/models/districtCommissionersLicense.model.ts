import { ObjectType } from '@nestjs/graphql'
import { OccupationalLicenseV2 } from './occupationalLicense.model'

@ObjectType('OccupationalLicensesV2DistrictCommissionersLicense', {
  implements: () => OccupationalLicenseV2,
})
export class DistrictCommissionersLicense extends OccupationalLicenseV2 {}

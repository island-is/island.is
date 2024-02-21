import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'

@ObjectType('OccupationalLicensesV2DistrictCommissionersLicense', {
  implements: () => License,
})
export class DistrictCommissionersLicense extends License {
  @Field()
  issuerId?: string
}

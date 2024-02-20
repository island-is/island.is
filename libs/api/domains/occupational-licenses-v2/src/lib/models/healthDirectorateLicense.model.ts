import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { OccupationalLicenseV2 } from './occupationalLicense.model'

@ObjectType('OccupationalLicensesV2HealthDirectorateLicense', {
  implements: () => OccupationalLicenseV2,
})
export class HealthDirectorateLicense extends OccupationalLicenseV2 {
  @Field()
  legalEntityId?: string

  @Field()
  number?: string

  @Field(() => Int)
  id?: number
}

import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'

@ObjectType('OccupationalLicensesV2HealthDirectorateLicense', {
  implements: () => License,
})
export class HealthDirectorateLicense extends License {
  @Field()
  legalEntityId?: string
}

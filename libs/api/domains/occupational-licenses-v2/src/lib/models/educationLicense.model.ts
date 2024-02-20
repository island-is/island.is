import { Field, ObjectType } from '@nestjs/graphql'
import { OccupationalLicenseV2 } from './occupationalLicense.model'

@ObjectType('OccupationalLicensesV2EducationLicense', {
  implements: () => OccupationalLicenseV2,
})
export class EducationLicense extends OccupationalLicenseV2 {
  @Field({ nullable: true })
  downloadURI?: string
}

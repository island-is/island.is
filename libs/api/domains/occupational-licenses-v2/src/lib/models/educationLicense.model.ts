import { Field, ObjectType } from '@nestjs/graphql'
import { License } from './license.model'

@ObjectType('OccupationalLicensesV2EducationLicense', {
  implements: () => License,
})
export class EducationLicense extends License {
  @Field({ nullable: true })
  downloadURI?: string
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'

@ObjectType('OccupationalLicensesEducationalLicense', {
  implements: () => OccupationalLicense,
})
export class EducationalLicense implements OccupationalLicense {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  type!: string

  @Field(() => String)
  profession!: string

  @Field(() => String)
  validFrom!: string
  @Field(() => String)
  downloadUrl?: string

  @Field(() => Boolean)
  isValid!: boolean
}

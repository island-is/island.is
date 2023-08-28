import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesEducationalLicense')
export class EducationalLicense {
  @Field(() => String)
  id!: string

  @Field(() => String)
  school!: string

  @Field(() => String)
  programme!: string

  @Field(() => String)
  date!: string
  @Field(() => String)
  url?: string

  @Field(() => Boolean)
  isValid!: boolean
}

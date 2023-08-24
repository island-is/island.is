import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicenseError')
export class OccupationalLicenseError {
  @Field(() => Boolean)
  hasError!: boolean
}

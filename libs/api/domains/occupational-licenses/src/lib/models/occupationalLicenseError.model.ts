import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesError')
export class OccupationalLicensesError {
  @Field(() => Boolean)
  hasError!: boolean
}

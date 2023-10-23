import { ObjectType, Field, Int } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'
import { OccupationalLicensesError } from './occupationalLicenseError.model'

@ObjectType('OccupationalLicensesList')
export class OccupationalLicensesList {
  @Field(() => Int)
  count!: number

  @Field(() => [OccupationalLicense])
  items!: Array<OccupationalLicense>

  @Field(() => [OccupationalLicensesError])
  errors!: OccupationalLicensesError[]
}

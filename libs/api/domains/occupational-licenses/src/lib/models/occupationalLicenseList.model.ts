import { ObjectType, Field, Int } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'
import { OccupationalLicensesError } from './OccupationalLicensesError.model'

@ObjectType('OccupationalLicensesList')
export class OccupationalLicensesList {
  @Field(() => Int)
  count!: number

  @Field(() => [OccupationalLicense])
  items?: Array<typeof OccupationalLicense>

  @Field(() => OccupationalLicensesError)
  error!: OccupationalLicensesError
}

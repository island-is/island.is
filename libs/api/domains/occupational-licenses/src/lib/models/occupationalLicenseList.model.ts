import { ObjectType, Field, Int } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'
import { OccupationalLicenseError } from './occupationalLicenseError.model'

@ObjectType('OccupationalLicenseList')
export class OccupationalLicenseList {
  @Field(() => Int)
  count!: number

  @Field(() => [OccupationalLicense, { nullable: true }])
  items?: Array<typeof OccupationalLicense> | null

  @Field(() => OccupationalLicenseError)
  error!: OccupationalLicenseError
}

import { ObjectType, Field, Int } from '@nestjs/graphql'
import { OccupationalLicense } from './occupationalLicense.model'

@ObjectType('OccupationalLicenseList')
export class OccupationalLicenseList {
  @Field(() => Int)
  count!: number

  @Field(() => [OccupationalLicense, { nullable: true }])
  items?: Array<typeof OccupationalLicense> | null
}

import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CheckTachoNetInput {
  @Field()
  firstName?: string

  @Field()
  lastName!: string

  @Field()
  birthDate!: Date

  @Field()
  birthPlace?: string

  @Field()
  drivingLicenceNumber?: string

  @Field()
  drivingLicenceIssuingCountry?: string
}

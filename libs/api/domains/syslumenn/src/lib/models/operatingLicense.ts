import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class OperatingLicense {
  @Field({ nullable: true })
  id?: number

  @Field({ nullable: true })
  issuedBy?: string

  @Field({ nullable: true })
  licenseNumber?: string

  @Field({ nullable: true })
  location?: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  street?: string

  @Field({ nullable: true })
  postalCode?: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  validUntil?: string

  @Field({ nullable: true })
  licenseHolder?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  outdoorLicense?: string

  @Field({ nullable: true })
  alcoholWeekdayLicense?: string

  @Field({ nullable: true })
  alcoholWeekendLicense?: string

  @Field({ nullable: true })
  alcoholWeekdayOutdoorLicense?: string

  @Field({ nullable: true })
  alcoholWeekendOutdoorLicense?: string
}


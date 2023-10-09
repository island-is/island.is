import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DrivingLicenseBook } from './drivingLicenseBook.response'

@ObjectType()
export class DrivingLicenseBookStudent {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field()
  zipCode!: number

  @Field()
  address!: string

  @Field()
  email!: string

  @Field()
  primaryPhoneNumber!: string

  @Field()
  secondaryPhoneNumber!: string

  @Field()
  active!: boolean

  @Field(() => [String])
  bookLicenseCategories!: string[]
}

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { DrivingSchoolType } from './drivingLicenseBookSchoolType.response'
@ObjectType()
export class DrivingLicenseBookSchool {
  @Field(() => ID)
  nationalId!: string

  @Field()
  name!: string

  @Field()
  address!: string

  @Field()
  zipCode!: string

  @Field()
  phoneNumber!: string

  @Field()
  email!: string

  @Field()
  website!: string

  @Field(() => [DrivingSchoolType])
  allowedDrivingSchoolTypes!: DrivingSchoolType[]
}

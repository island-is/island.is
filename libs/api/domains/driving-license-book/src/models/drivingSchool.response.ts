import { Field, ObjectType } from '@nestjs/graphql'
@ObjectType()
export class DrivingSchool {
  @Field()
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

  @Field(() => [String])
  allowedDrivingSchoolTypes!: string[]
}

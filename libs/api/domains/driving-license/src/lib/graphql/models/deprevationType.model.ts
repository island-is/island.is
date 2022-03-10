import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseDeprevationType {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}

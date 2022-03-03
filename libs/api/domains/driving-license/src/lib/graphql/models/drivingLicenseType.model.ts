import { Field, ID,ObjectType } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicenseType {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string
}

import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string
}

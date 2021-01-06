import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class DrivingLicense {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  type!: string

  @Field(() => Date)
  expires!: Date
}

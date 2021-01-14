import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class HealthTest {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  fullName!: string
}

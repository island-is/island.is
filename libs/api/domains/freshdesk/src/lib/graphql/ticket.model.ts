import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Ticket {
  @Field(() => ID)
  id!: number

  @Field(() => String)
  subject!: string
}

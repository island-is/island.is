import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Disqualification {
  @Field(() => String)
  to!: Date
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Broker {
  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string
}

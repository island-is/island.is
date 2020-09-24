import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Car } from '../../car'

@ObjectType()
export class User {
  @Field((_1) => ID)
  nationalId: string

  @Field()
  name: string

  @Field({ nullable: true })
  mobile?: string
}

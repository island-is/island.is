import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Jurisdiction {
  @Field(() => ID)
  id!: number

  @Field()
  zip!: number

  @Field()
  name!: string
}

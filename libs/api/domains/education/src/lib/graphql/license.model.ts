import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class License {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  school!: string

  @Field(() => String)
  programme!: string

  @Field(() => String)
  date!: string
}

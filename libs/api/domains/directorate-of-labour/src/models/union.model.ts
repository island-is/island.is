import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class Union {
  @Field(() => String)
  id!: string

  @Field(() => String)
  name!: string
}

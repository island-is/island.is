import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericPkPass {
  @Field(() => String)
  pkpassUrl!: string
}

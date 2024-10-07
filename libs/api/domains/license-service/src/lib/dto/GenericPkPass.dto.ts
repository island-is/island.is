import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class GenericPkPass {
  @Field()
  pkpassUrl!: string
}

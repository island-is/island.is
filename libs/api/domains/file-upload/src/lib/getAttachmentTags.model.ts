import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class TagType {
  @Field(() => String)
  Key!: string

  @Field(() => String)
  Value!: string
}
import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class Document {
  @Field((type) => ID)
  id: string

  @Field((type) => String)
  name: string
}

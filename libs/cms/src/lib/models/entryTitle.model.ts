import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class EntryTitle {
  @Field(() => String)
  title!: string
}

import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('FormSystemListItem')
export class ListItem {
  @Field(() => String, { nullable: true })
}

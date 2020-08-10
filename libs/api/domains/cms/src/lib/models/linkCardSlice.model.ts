import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LinkCard } from './linkCard.model'

@ObjectType()
export class LinkCardSlice {
  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [LinkCard])
  cards: LinkCard[]
}

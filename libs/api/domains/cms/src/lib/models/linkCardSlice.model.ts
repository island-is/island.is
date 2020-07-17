import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LinkCard } from './linkCard.model'

@ObjectType()
export class LinkCardSlice {
  @Field(type => ID)
  id: string

  @Field()
  title: string

  @Field(type => [LinkCard])
  cards: LinkCard[]
}

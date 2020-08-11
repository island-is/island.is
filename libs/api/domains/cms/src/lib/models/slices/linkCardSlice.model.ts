import { Field, ID, ObjectType } from '@nestjs/graphql'
import { LinkCard } from '../linkCard.model'

@ObjectType()
export class LinkCardSlice {
  constructor(initializer: LinkCardSlice) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [LinkCard])
  cards: LinkCard[]
}

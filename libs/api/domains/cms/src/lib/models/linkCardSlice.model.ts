import { Field, ID, ObjectType } from '@nestjs/graphql'

import { ICardSection } from '../generated/contentfulTypes'

import { LinkCard, mapLinkCard } from './linkCard.model'

@ObjectType()
export class LinkCardSlice {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field(() => [LinkCard])
  cards: LinkCard[]
}

export const mapLinkCardSlice = ({
  fields,
  sys,
}: ICardSection): LinkCardSlice => ({
  typename: 'LinkCardSlice',
  id: sys.id,
  title: fields?.title ?? '',
  cards: fields.cards.map(mapLinkCard),
})

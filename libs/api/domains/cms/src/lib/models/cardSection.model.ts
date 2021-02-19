import { Field, ObjectType } from '@nestjs/graphql'

import { ICardSection } from '../generated/contentfulTypes'

import { Card, mapCard } from './card.model'

@ObjectType()
export class CardSection {
  @Field({ nullable: true })
  title?: string

  @Field(() => [Card])
  cards: Array<Card>
}

export const mapCardSection = ({ fields }: ICardSection): CardSection => ({
  title: fields.title ?? '',
  cards: fields.cards.map(mapCard),
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ICardSection } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { LinkCard, mapLinkCard } from './linkCard.model'

@ObjectType()
export class LinkCardSlice {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @Field(() => [LinkCard])
  cards!: LinkCard[]
}

export const mapLinkCardSlice = ({
  fields,
  sys,
}: ICardSection): SystemMetadata<LinkCardSlice> => ({
  typename: 'LinkCardSlice',
  id: sys.id,
  title: fields.title ?? '',
  cards: (fields.cards ?? []).map(mapLinkCard),
})

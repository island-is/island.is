import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IOpenDataPage } from '../generated/contentfulTypes'
import * as types from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { Image, mapImage } from './image.model'
import { LinkCard, mapLinkCard } from './linkCard.model'

@ObjectType()
export class OpenDataPage {
  @Field(() => ID)
  id!: string

  @Field()
  pageTitle!: string

  @Field()
  pageDescription!: string

  @Field()
  pageHeaderGraph?: IGraph

  @Field()
  link?: string

  @Field()
  linkTitle?: string

  @Field()
  externalLinkCards?: ICard[]

  @Field()
  externalLinkSectionBody?: string

  @Field()
  externalLinkSectionTitle?: string

  @Field()
  externalLinkSectionImage?: Image | null

  @Field()
  statisticSection?: ICardSection

  @Field()
  chartSectionTitle?: string

  @Field()
  graphCards?: IGraphCard[]
}

export const mapOpenDataPage = ({
  fields,
  sys,
}: types.IOpenDataPage): SystemMetadata<OpenDataPage> => ({
  typename: 'OpenDataPage',
  id: sys.id,
  pageTitle: fields.pageTitle ?? '',
  pageDescription: fields.pageDescription ?? '',
  externalLinkSectionImage: fields.externalLinkSectionImage ? mapImage(fields.externalLinkSectionImage) : null,
})

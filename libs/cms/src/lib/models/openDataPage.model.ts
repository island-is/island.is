import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import * as types from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { LinkCardSlice, mapLinkCardSlice } from './linkCardSlice.model'
import { GraphCard, mapGraphCard } from './graphCard.model'
import { StatisticsCard, mapStatisticsCard } from './statisticsCard.model'

@ObjectType()
export class OpenDataPage {
  @Field(() => ID)
  id!: string

  @Field()
  pageTitle!: string

  @Field()
  pageDescription!: string

  @CacheField(() => GraphCard)
  pageHeaderGraph?: GraphCard | null

  @Field()
  link?: string

  @Field()
  linkTitle?: string

  @CacheField(() => [StatisticsCard])
  statisticsCardsSection?: Array<StatisticsCard>

  @Field()
  chartSectionTitle?: string

  @CacheField(() => [GraphCard])
  graphCards?: Array<GraphCard>

  @CacheField(() => LinkCardSlice)
  externalLinkCardSelection?: LinkCardSlice | null

  @Field()
  externalLinkSectionTitle?: string

  @Field()
  externalLinkSectionDescription?: string

  @CacheField(() => Image, { nullable: true })
  externalLinkSectionImage?: Image | null
}

export const mapOpenDataPage = ({
  fields,
  sys,
}: types.IOpenDataPage): SystemMetadata<OpenDataPage> => ({
  typename: 'OpenDataPage',
  id: sys.id,
  pageTitle: fields.pageTitle ?? '',
  pageDescription: fields.pageDescription ?? '',
  pageHeaderGraph: fields.pageHeaderGraph
    ? mapGraphCard(fields.pageHeaderGraph)
    : null,
  link: fields.link ?? '',
  linkTitle: fields.linkTitle ?? '',
  statisticsCardsSection: (fields.statisticsCardsSection ?? []).map(
    mapStatisticsCard,
  ),
  chartSectionTitle: fields.chartSectionTitle ?? '',
  externalLinkCardSelection: fields.externalLinkCardSelection
    ? mapLinkCardSlice(fields.externalLinkCardSelection)
    : null,
  graphCards: (fields.graphCards ?? []).map(mapGraphCard),
  externalLinkSectionTitle: fields.externalLinkSectionTitle ?? '',
  externalLinkSectionDescription: fields.externalLinkSectionDescription ?? '',
  externalLinkSectionImage: fields.externalLinkSectionImage
    ? mapImage(fields.externalLinkSectionImage)
    : null,
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IOpenDataPage } from '../generated/contentfulTypes'
import * as types from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { Image, mapImage } from './image.model'
import { SectionWithImage, mapSectionWithImage } from './SectionWithImage.model'
import { LinkCardSlice, mapLinkCardSlice } from './linkCardSlice.model'
import { Graph, mapGraph } from './graph.model'
import { GraphCard, mapGraphCard } from './graphCard.model'

@ObjectType()
export class OpenDataPage {
  @Field(() => ID)
  id!: string

  @Field()
  pageTitle!: string

  @Field()
  pageDescription!: string

  @Field()
  pageHeaderGraph?: Graph | null

  @Field()
  link?: string

  @Field()
  linkTitle?: string

  @Field(() => LinkCardSlice)
  statisticSection?: LinkCardSlice | null

  @Field()
  chartSectionTitle?: string

  @Field(() => [GraphCard])
  graphCards?: Array<GraphCard>

  @Field(() => LinkCardSlice)
  externalLinkCardSelection?: LinkCardSlice | null

//   @Field()
//   externalLinkSection?: SectionWithImage
}

export const mapOpenDataPage = ({
  fields,
  sys,
}: types.IOpenDataPage): SystemMetadata<OpenDataPage> => ({
  typename: 'OpenDataPage',
  id: sys.id,
  pageTitle: fields.pageTitle ?? '',
  pageDescription: fields.pageDescription ?? '',
  pageHeaderGraph: fields.pageHeaderGraph ? mapGraph(fields.pageHeaderGraph) : null,
  link: fields.link ?? '',
  linkTitle: fields.linkTitle ?? '',
  statisticSection: fields.statisticSection ? mapLinkCardSlice(fields.statisticSection ) : null,
  chartSectionTitle: fields.chartSectionTitle ?? '',
  externalLinkCardSelection: fields.externalLinkCardSelection ? mapLinkCardSlice(fields.externalLinkCardSelection ) : null,
  graphCards: (fields.graphCards ?? []).map(mapGraphCard)
  
})

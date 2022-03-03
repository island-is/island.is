import { Field, ID, ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import * as types from '../generated/contentfulTypes'

import { GraphCard, mapGraphCard } from './graphCard.model'
import { Image, mapImage } from './image.model'
import { mapStatisticsCard,StatisticsCard } from './statisticsCard.model'

@ObjectType()
export class OpenDataSubpage {
  @Field(() => ID)
  id!: string

  @Field()
  pageTitle!: string

  @Field()
  fundTitle!: string

  @Field()
  fundDescription!: string

  @Field(() => [StatisticsCard])
  statisticsCards?: Array<StatisticsCard>

  @Field(() => [GraphCard])
  graphCards?: Array<GraphCard>

  @Field(() => Image, { nullable: true })
  organizationLogo?: Image | null
}

export const mapOpenDataSubpage = ({
  fields,
  sys,
}: types.IOpenDataSubpage): SystemMetadata<OpenDataSubpage> => ({
  typename: 'openDataSubpage',
  id: sys.id,
  pageTitle: fields.pageTitle ?? '',
  fundTitle: fields.fundTitle ?? '',
  fundDescription: fields.fundDescription ?? '',
  statisticsCards: (fields.statisticsCards ?? []).map(mapStatisticsCard),
  graphCards: (fields.graphCards ?? []).map(mapGraphCard),
  organizationLogo: fields.organizationLogo
    ? mapImage(fields.organizationLogo)
    : null,
})

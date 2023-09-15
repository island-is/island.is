import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IGraphCard } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class GraphCard {
  @Field(() => ID)
  id!: string

  @Field()
  graphTitle!: string

  @Field()
  graphDescription?: string

  @Field({ nullable: true })
  organization?: string

  @Field()
  data!: string

  @Field()
  datakeys!: string

  @Field()
  type?: string

  @Field()
  displayAsCard!: boolean

  @CacheField(() => Image, { nullable: true })
  organizationLogo?: Image | null
}

export const mapGraphCard = ({
  sys,
  fields,
}: IGraphCard): SystemMetadata<GraphCard> => {
  return {
    typename: 'GraphCard',
    id: sys?.id ?? '',
    graphTitle: fields?.graphTitle ?? '',
    graphDescription: fields?.graphDescription ?? '',
    organization: fields?.organization ?? '',
    data: fields.data ? JSON.stringify(fields.data) : '',
    datakeys: fields.datakeys ? JSON.stringify(fields.datakeys) : '',
    type: fields?.type ?? '',
    displayAsCard: fields.displayAsCard ?? true,
    organizationLogo: fields.organizationLogo
      ? mapImage(fields.organizationLogo)
      : null,
  }
}

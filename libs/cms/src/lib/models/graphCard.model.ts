import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from 'api-cms-domain'
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

  @Field(() => Image, { nullable: true })
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

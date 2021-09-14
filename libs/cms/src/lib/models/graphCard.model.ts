import { Field, ObjectType } from '@nestjs/graphql'
import { IGraphCard } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'

@ObjectType()
export class GraphCard {
  @Field()
  graphTitle!: string

  @Field()
  graphDescription?: string

  @Field({ nullable: true })
  organization?: string

  @Field({ nullable: true })
  graph?: null

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

export const mapGraphCard = ({ fields }: IGraphCard): GraphCard => {
  return {
    graphTitle: fields?.graphTitle ?? '',
    graphDescription: fields?.graphDescription ?? '',
    organization: fields?.organization ?? '',
    graph: null,
    data: fields.data ? JSON.stringify(fields.data) : '',
    datakeys: fields.datakeys ? JSON.stringify(fields.datakeys) : '',
    type: fields?.type ?? '',
    displayAsCard: fields.displayAsCard ?? true,
    organizationLogo: fields.organizationLogo
      ? mapImage(fields.organizationLogo)
      : null,
  }
}

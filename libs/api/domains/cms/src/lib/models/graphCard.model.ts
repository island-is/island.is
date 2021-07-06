import { Field, ObjectType } from '@nestjs/graphql'
import { IGraphCard } from '../generated/contentfulTypes'
import { Graph, mapGraph } from './graph.model'
import { mapReferenceLink, ReferenceLink } from './referenceLink.model'

@ObjectType()
export class GraphCard {
 @Field()
 graphTitle!: string

 @Field()
 graphDescription?: string | undefined

 @Field()
 organization?: string | undefined

 @Field(() => Graph)
 graph?: Graph | null
}

export const mapGraphCard = ({ fields }: IGraphCard): GraphCard => {
  return {
    graphTitle: fields?.graphTitle ?? '',
    graphDescription: fields?.graphDescription ?? '',
    organization: fields?.organization ?? '',
    graph: fields.graph ? mapGraph(fields.graph) : null
  }
}

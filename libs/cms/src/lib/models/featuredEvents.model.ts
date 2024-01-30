import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'
import { EventList } from './eventList.model'
import { IFeaturedEvents } from '../generated/contentfulTypes'
import { GetEventsInput } from '../dto/getEvents.input'
import { GraphQLJSONObject } from 'graphql-type-json'
import { SliceUnion, mapDocument } from '../unions/slice.union'

@ObjectType()
export class FeaturedEvents {
  @Field(() => ID)
  id!: string

  @Field(() => String, { nullable: true })
  organization?: string

  @CacheField(() => EventList)
  resolvedEventList!: GetEventsInput

  @CacheField(() => GraphQLJSONObject)
  namespace?: typeof GraphQLJSONObject

  @CacheField(() => [SliceUnion], { nullable: true })
  noEventsFoundText?: Array<typeof SliceUnion>
}

export const mapFeaturedEvents = ({ sys, fields }: IFeaturedEvents) => ({
  typename: 'FeaturedEvents',
  id: sys.id,
  noEventsFoundText: fields.noEventsFoundText
    ? mapDocument(fields.noEventsFoundText, sys.id + ':noEventsFoundText')
    : [],
  resolvedEventList: {
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    organization: fields.organization?.fields?.slug,
    size: 10,
  },
})

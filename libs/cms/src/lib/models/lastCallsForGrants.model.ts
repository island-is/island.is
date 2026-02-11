import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import {
  GetGrantsInput,
  GrantsAvailabilityStatus,
} from '../dto/getGrants.input'
import { GrantList } from './grantList.model'
import { SystemMetadata } from '@island.is/shared/types'
import { ILastCallsForGrants } from '../generated/contentfulTypes'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

@ObjectType()
export class LastCallsForGrants {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => GraphQLJSONObject)
  namespace?: typeof GraphQLJSONObject

  @CacheField(() => GrantList, { nullable: true })
  resolvedGrantsList?: GetGrantsInput

  @Field({ nullable: true })
  onlyShowOpenForApplication?: boolean

  @Field(() => Int, { nullable: true })
  maxNumberOfCards?: number
}

export const mapLastCallsForGrants = ({
  fields,
  sys,
}: ILastCallsForGrants): SystemMetadata<LastCallsForGrants> => {
  return {
    typename: 'LastCallsForGrants',
    id: sys.id,
    title: fields.title,
    resolvedGrantsList: {
      lang:
        sys.locale === 'is-IS'
          ? 'is'
          : (sys.locale as ElasticsearchIndexLocale),
      organizations: fields?.parentOrganization?.fields.slug
        ? [fields.parentOrganization.fields.slug]
        : undefined,
      size: fields.maxNumberOfCards,
      filterOutDateToPassed: true,
      status: fields.onlyShowOpenForApplication
        ? GrantsAvailabilityStatus.OPEN
        : undefined,
    },
    onlyShowOpenForApplication: fields.onlyShowOpenForApplication,
    maxNumberOfCards: fields.maxNumberOfCards,
  }
}

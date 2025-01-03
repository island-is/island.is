import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'

import { IGrantCardsList } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { GrantList } from './grantList.model'
import { GraphQLJSONObject } from 'graphql-type-json'
import { GetGrantsInput } from '../dto/getGrants.input'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'

enum CardSorting {
  ALPHABETICAL,
  MOST_RECENTLY_UPDATED_FIRST,
}

registerEnumType(CardSorting, { name: 'GrantCardsListSorting' })

@ObjectType()
export class GrantCardsList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  displayTitle?: boolean

  @CacheField(() => GrantList, { nullable: true })
  resolvedGrantsList?: GetGrantsInput

  @CacheField(() => GraphQLJSONObject)
  namespace?: typeof GraphQLJSONObject
}

export const mapGrantCardsList = ({
  fields,
  sys,
}: IGrantCardsList): SystemMetadata<GrantCardsList> => {
  return {
    typename: 'GrantCardsList',
    id: sys.id,
    title: fields.grantCardListTitle,
    displayTitle: fields.grantCardsListDisplayTitle,
    resolvedGrantsList: {
      lang:
        sys.locale === 'is-IS'
          ? 'is'
          : (sys.locale as ElasticsearchIndexLocale),
      funds: fields?.grantCardListFunds?.map((f) => f.sys.id) ?? undefined,
      size: fields.grantCardsListMaxNumberOfCards,
    },
  }
}

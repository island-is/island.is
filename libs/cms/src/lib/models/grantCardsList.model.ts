import { Field, ObjectType, ID, registerEnumType, Int } from '@nestjs/graphql'

import { IGrantCardsList } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { GrantList } from './grantList.model'
import { GraphQLJSONObject } from 'graphql-type-json'
import { GetGrantsInput } from '../dto/getGrants.input'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { GenericTag, mapGenericTag } from './genericTag.model'

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

  @Field()
  alwaysDisplayResultsAsCards!: boolean

  @Field({ nullable: true })
  displayTitle?: boolean

  @CacheField(() => GrantList, { nullable: true })
  resolvedGrantsList?: GetGrantsInput

  @CacheField(() => GraphQLJSONObject)
  namespace?: typeof GraphQLJSONObject

  @Field(() => Int, { nullable: true })
  maxNumberOfCards?: number

  @CacheField(() => CardSorting, { nullable: true })
  sorting?: CardSorting

  @Field(() => Boolean, { nullable: true })
  showSearchInput?: boolean

  @Field(() => String, { nullable: true })
  searchInputPlaceholder?: string

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]

  @Field(() => Boolean, { nullable: true })
  alphabeticallyOrderFilterTags?: boolean

  @Field(() => Boolean, { nullable: true })
  showPagination?: boolean

  @Field(() => [String], { nullable: true })
  fundIds?: string[]
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
    maxNumberOfCards: fields.grantCardsListMaxNumberOfCards,
    //returns false if and only if the field is false
    alwaysDisplayResultsAsCards: !(
      fields.grantCardsAlwaysDisplayResultsAsCards === false
    ),
    sorting:
      fields.grantCardsListSorting &&
      fields.grantCardsListSorting === 'Alphabetical'
        ? CardSorting.ALPHABETICAL
        : CardSorting.MOST_RECENTLY_UPDATED_FIRST,
    showSearchInput: fields.grantCardsListShowSearchInput ?? false,
    searchInputPlaceholder: fields.grantCardsListSearchInputPlaceholder,
    filterTags: fields.grantCardsListFilterTags?.map(mapGenericTag) ?? [],
    alphabeticallyOrderFilterTags:
      fields.grantCardsListAlphabeticallyOrderFilterTags ?? false,
    showPagination: fields.grantCardsListShowPagination ?? false,
    fundIds: fields.grantCardListFunds?.map((f) => f.sys.id) ?? [],
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

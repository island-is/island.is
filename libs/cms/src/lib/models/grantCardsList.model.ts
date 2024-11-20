import { Field, ObjectType, ID, registerEnumType, Int } from '@nestjs/graphql'

import { IGrantCardsList } from '../generated/contentfulTypes'
import { CacheField } from '@island.is/nest/graphql'
import { Fund, mapFund } from './fund.model'
import { SystemMetadata } from '@island.is/shared/types'
import { logger } from '@island.is/logging'

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

  @CacheField(() => [Fund], { nullable: true })
  funds?: Array<Fund>

  @Field(() => Int, { nullable: true })
  maxNumberOfCards?: number

  @CacheField(() => CardSorting, { nullable: true })
  sorting?: CardSorting
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
    funds: fields.grantCardListFunds
      ? fields.grantCardListFunds.map((g) => mapFund(g))
      : undefined,
    maxNumberOfCards: fields.grantCardsListMaxNumberOfCards ?? undefined,
    sorting:
      fields.grantCardsListSorting === 'Alphabetical'
        ? CardSorting.ALPHABETICAL
        : fields.grantCardsListSorting === 'Most recently updated first'
        ? CardSorting.MOST_RECENTLY_UPDATED_FIRST
        : undefined,
  }
}

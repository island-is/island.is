import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericList } from '../generated/contentfulTypes'
import { GenericListItemResponse } from './genericListItemResponse.model'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'

@ObjectType()
export class GenericList {
  @Field(() => ID)
  id!: string

  @CacheField(() => GenericListItemResponse)
  firstPageListItemResponse!: GetGenericListItemsInput
}

export const mapGenericList = ({ sys }: IGenericList): GenericList => ({
  id: sys.id,
  firstPageListItemResponse: {
    genericListId: sys.id,
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    page: 1,
  },
})

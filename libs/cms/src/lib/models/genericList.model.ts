import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { SystemMetadata } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericList, IGenericListFields } from '../generated/contentfulTypes'
import { GenericListItemResponse } from './genericListItemResponse.model'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'

enum GenericListItemType {
  NonClickable = 'NonClickable',
  Clickable = 'Clickable',
}

registerEnumType(GenericListItemType, {
  name: 'GenericListItemType',
})

@ObjectType()
export class GenericList {
  @Field(() => ID)
  id!: string

  @CacheField(() => GenericListItemResponse)
  firstPageListItemResponse!: GetGenericListItemsInput

  @Field(() => String, { nullable: true })
  searchInputPlaceholder?: string

  @CacheField(() => GenericListItemType, { nullable: true })
  itemType?: GenericListItemType
}

const mapItemType = (itemType?: IGenericListFields['itemType']) =>
  itemType === 'Clickable'
    ? GenericListItemType.Clickable
    : GenericListItemType.NonClickable

export const mapGenericList = ({
  fields,
  sys,
}: IGenericList): SystemMetadata<GenericList> => ({
  typename: 'GenericList',
  id: sys.id,
  firstPageListItemResponse: {
    genericListId: sys.id,
    lang:
      sys.locale === 'is-IS' ? 'is' : (sys.locale as ElasticsearchIndexLocale),
    page: 1,
  },
  searchInputPlaceholder: fields.searchInputPlaceholder,
  itemType: mapItemType(fields.itemType),
})

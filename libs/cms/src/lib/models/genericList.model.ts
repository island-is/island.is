import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericList, IGenericListFields } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { GetGenericListItemsInputOrderBy } from '../dto/getGenericListItems.input'

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

  @Field(() => String, { nullable: true })
  searchInputPlaceholder?: string

  @CacheField(() => GenericListItemType, { nullable: true })
  itemType?: GenericListItemType

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]

  @CacheField(() => GetGenericListItemsInputOrderBy, { nullable: true })
  defaultOrder?: GetGenericListItemsInputOrderBy

  @Field(() => Boolean, { nullable: true })
  showSearchInput?: boolean

  @Field(() => Boolean, { nullable: true })
  alphabeticallyOrderFilterTags?: boolean
}

const mapItemType = (itemType?: IGenericListFields['itemType']) =>
  itemType === 'Clickable'
    ? GenericListItemType.Clickable
    : GenericListItemType.NonClickable

const mapOrderBy = (orderBy?: IGenericListFields['orderBy']) => {
  if (orderBy === 'Date') {
    return GetGenericListItemsInputOrderBy.DATE
  }
  if (orderBy === 'Title') {
    return GetGenericListItemsInputOrderBy.TITLE
  }
  if (orderBy === 'Publish Date') {
    return GetGenericListItemsInputOrderBy.PUBLISH_DATE
  }
  return undefined
}

export const mapGenericList = ({
  fields,
  sys,
}: IGenericList): SystemMetadata<GenericList> => ({
  typename: 'GenericList',
  id: sys.id,
  searchInputPlaceholder: fields.searchInputPlaceholder,
  itemType: mapItemType(fields.itemType),
  filterTags: fields.filterTags ? fields.filterTags.map(mapGenericTag) : [],
  defaultOrder: mapOrderBy(fields.orderBy),
  showSearchInput: fields.showSearchInput ?? true,
  alphabeticallyOrderFilterTags: fields.alphabeticallyOrderFilterTags ?? false,
})

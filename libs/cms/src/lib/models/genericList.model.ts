import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import { IGenericList, IGenericListFields } from '../generated/contentfulTypes'
import { GenericTag, mapGenericTag } from './genericTag.model'

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
  searchInputPlaceholder: fields.searchInputPlaceholder,
  itemType: mapItemType(fields.itemType),
  filterTags: fields.filterTags ? fields.filterTags.map(mapGenericTag) : [],
})

import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IFeaturedGenericListItems } from '../generated/contentfulTypes'

import { GenericListItem, mapGenericListItem } from './genericListItem.model'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'

class FeaturedGenericListItemsField {
  @CacheField(() => [GenericListItem])
  items!: Array<GenericListItem>

  @CacheField(() => GetGenericListItemsInput, { nullable: true })
  input!: GetGenericListItemsInput | null
}

@ObjectType()
export class FeaturedGenericListItems {
  @Field(() => ID)
  id!: string

  @CacheField(() => [GenericListItem])
  items!: FeaturedGenericListItemsField

  @Field(() => Boolean, { nullable: true })
  automaticallyFetchItems!: boolean
}

export const mapFeaturedGenericListItems = ({
  sys,
  fields,
}: IFeaturedGenericListItems): SystemMetadata<FeaturedGenericListItems> => {
  const tags: string[] = []
  const tagGroupsMap = new Map<string, string[]>()

  for (const tag of fields.filterTags ?? []) {
    tags.push(tag.fields.slug)
    if (tagGroupsMap.has(tag.fields.slug)) {
      tagGroupsMap.get(tag.fields.slug)?.push(tag.fields.slug)
    } else {
      tagGroupsMap.set(tag.fields.slug, [tag.fields.slug])
    }
  }

  const tagGroups = Object.fromEntries(tagGroupsMap)

  return {
    typename: 'FeaturedGenericListItems',
    id: sys.id,
    automaticallyFetchItems: fields.automaticallyFetchItems ?? false,
    items: {
      items: (fields.items ?? []).map(mapGenericListItem),
      input: fields.automaticallyFetchItems
        ? {
            genericListId: fields.genericList?.sys.id ?? '',
            lang:
              sys.locale === 'is-IS'
                ? 'is'
                : (sys.locale as ElasticsearchIndexLocale),
            tags,
            tagGroups,
          }
        : null,
    },
  }
}

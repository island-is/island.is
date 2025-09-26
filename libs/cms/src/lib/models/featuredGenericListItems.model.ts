import { Field, ID, ObjectType } from '@nestjs/graphql'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import type { IFeaturedGenericListItems } from '../generated/contentfulTypes'

import { GenericListItem, mapGenericListItem } from './genericListItem.model'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'

@ObjectType()
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

  @Field(() => String)
  baseUrl!: string

  @Field(() => Boolean, { nullable: true })
  automaticallyFetchItems!: boolean

  @Field(() => String, { nullable: true })
  seeMoreLinkTextString?: string
}

export const mapFeaturedGenericListItems = ({
  sys,
  fields,
}: IFeaturedGenericListItems): SystemMetadata<FeaturedGenericListItems> => {
  const tags: string[] = []
  const tagGroupsMap = new Map<string, string[]>()

  for (const tag of fields.filterTags ?? []) {
    const tagSlug = tag.fields.slug
    const groupSlug = tag.fields.genericTagGroup?.fields?.slug
    tags.push(tagSlug)
    if (groupSlug) {
      const arr = tagGroupsMap.get(groupSlug) ?? []
      arr.push(tagSlug)
      tagGroupsMap.set(groupSlug, arr)
    }
  }

  const tagGroups = Object.fromEntries(tagGroupsMap)
  let baseUrl = ''

  if (
    fields.organizationPage?.fields?.slug &&
    fields.organizationSubpage?.fields?.slug
  ) {
    baseUrl = `/${getOrganizationPageUrlPrefix(sys.locale)}/${
      fields.organizationPage.fields.slug
    }/${fields.organizationSubpage.fields.slug}`
  }

  return {
    typename: 'FeaturedGenericListItems',
    id: sys.id,
    automaticallyFetchItems: fields.automaticallyFetchItems ?? false,
    baseUrl,
    seeMoreLinkTextString:
      fields.seeMoreLinkText ||
      (sys.locale === 'is-IS' ? 'Sjá meira' : 'See more'),
    items: {
      items: (fields.items ?? []).map(mapGenericListItem),
      input:
        fields.automaticallyFetchItems && fields.genericList?.sys.id
          ? {
              genericListId: fields.genericList.sys.id,
              lang:
                sys.locale === 'is-IS'
                  ? 'is'
                  : (sys.locale as ElasticsearchIndexLocale),
              tags,
              tagGroups,
              size: 10,
            }
          : null,
    },
  }
}

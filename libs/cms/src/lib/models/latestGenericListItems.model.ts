import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import {
  ILatestGenericListItems,
  IOrganizationSubpage,
} from '../generated/contentfulTypes'
import { GenericList, mapGenericList } from './genericList.model'
import { mapPageUnion, PageUnion } from '../unions/page.union'
import { GetGenericListItemsInput } from '../dto/getGenericListItems.input'
import { GenericListItemResponse } from './genericListItemResponse.model'
import { ElasticsearchIndexLocale } from '@island.is/content-search-index-manager'
import { mapOrganizationSubpage } from './organizationSubpage.model'

@ObjectType()
export class LatestGenericListItems {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => GenericList, { nullable: true })
  genericList?: GenericList | null

  @CacheField(() => PageUnion, { nullable: true })
  seeMorePage?: typeof PageUnion | null

  @Field()
  seeMoreLinkText?: string

  @CacheField(() => GenericListItemResponse, { nullable: true })
  itemResponse?: GetGenericListItemsInput | null // This field is populated by resolver
}

const mapSeeMorePage = (seeMorePage: IOrganizationSubpage | undefined) => {
  if (!seeMorePage) {
    return null
  }
  if (seeMorePage.sys.contentType.sys.id !== 'organizationSubpage') {
    return mapPageUnion(seeMorePage)
  }

  return mapOrganizationSubpage({
    ...seeMorePage,
    fields: {
      title: seeMorePage.fields?.title,
      slug: seeMorePage.fields?.slug,
      organizationPage: {
        ...seeMorePage.fields?.organizationPage,
        fields: {
          title: seeMorePage.fields?.organizationPage?.fields?.title,
          slug: seeMorePage.fields?.organizationPage?.fields?.slug,
          featuredImage:
            seeMorePage.fields?.organizationPage?.fields?.featuredImage,
          organization:
            seeMorePage.fields?.organizationPage?.fields?.organization,
          theme: seeMorePage.fields?.organizationPage?.fields?.theme,
        },
      },
    },
  })
}

export const mapLatestGenericListItems = ({
  fields,
  sys,
}: ILatestGenericListItems): SystemMetadata<LatestGenericListItems> => {
  const genericList = fields.genericList
    ? mapGenericList(fields.genericList)
    : null
  return {
    typename: 'LatestGenericListItems',
    id: sys.id,
    title: fields.title ?? '',
    genericList,
    seeMorePage: mapSeeMorePage(fields.seeMorePage),
    seeMoreLinkText: fields.seeMoreLinkText ?? '',
    itemResponse: fields.genericList?.sys.id
      ? {
          genericListId: fields.genericList?.sys.id,
          lang:
            sys.locale === 'is-IS'
              ? 'is'
              : (sys.locale as ElasticsearchIndexLocale),
          page: 1,
          size: fields.itemCount ?? 2,
          orderBy: genericList?.defaultOrder,
        }
      : null,
  }
}

import { CacheField } from '@island.is/nest/graphql'
import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import type { SystemMetadata } from '@island.is/shared/types'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'
import type { IOrganizationParentSubpageList } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'

enum Variant {
  ServiceCard = 'ServiceCard',
  ProfileCardWithTitleAbove = 'ProfileCardWithTitleAbove',
}

registerEnumType(Variant, {
  name: 'OrganizationParentSubpageListVariant',
})

@ObjectType('OrganizationParentSubpageListPageLink')
class PageLink {
  @Field(() => ID)
  id!: string

  @Field()
  label!: string

  @Field()
  href!: string

  @Field(() => String, { nullable: true })
  thumbnailImageHref?: string | null

  @Field(() => String, { nullable: true })
  tinyThumbnailImageHref?: string | null

  @Field()
  pageLinkIntro!: string
}

@ObjectType()
export class OrganizationParentSubpageList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @CacheField(() => Variant)
  pageLinkVariant!: Variant

  @CacheField(() => [PageLink])
  pageLinks!: PageLink[]

  @CacheField(() => Link, { nullable: true })
  seeMoreLink?: Link | null
}

export const mapOrganizationParentSubpageList = ({
  sys,
  fields,
}: IOrganizationParentSubpageList): SystemMetadata<OrganizationParentSubpageList> => {
  return {
    typename: 'OrganizationParentSubpageList',
    id: sys.id,
    title: fields.displayedTitle ?? '',
    pageLinkVariant:
      fields.variant === 'Profile Card - Title Above'
        ? Variant.ProfileCardWithTitleAbove
        : Variant.ServiceCard,
    pageLinks: (fields.pageList ?? [])
      .filter(
        (page) =>
          Boolean(page?.fields?.organizationPage?.fields?.slug) &&
          Boolean(page?.fields?.slug) &&
          Boolean(page?.fields?.title),
      )
      .map((page) => {
        let thumbnailImageHref =
          page.fields.thumbnailImage?.fields?.file?.url ?? ''
        if (thumbnailImageHref.startsWith('//')) {
          thumbnailImageHref = `https:${thumbnailImageHref}`
        }
        let tinyThumbnailImageHref =
          page.fields.tinyThumbnailImage?.fields?.file?.url ?? ''
        if (tinyThumbnailImageHref.startsWith('//')) {
          tinyThumbnailImageHref = `https:${tinyThumbnailImageHref}`
        }
        return {
          id: page.sys.id,
          label: page.fields.title ?? '',
          href: `/${getOrganizationPageUrlPrefix(sys.locale)}/${
            page.fields.organizationPage.fields.slug
          }/${page.fields.slug}`,
          thumbnailImageHref,
          tinyThumbnailImageHref,
          pageLinkIntro: page.fields.pages?.[0]?.fields?.intro ?? '',
        }
      }),
    seeMoreLink: fields.seeMoreLink ? mapLink(fields.seeMoreLink) : null,
  }
}

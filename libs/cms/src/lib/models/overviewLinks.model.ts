import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'

import { IOverviewLinks } from '../generated/contentfulTypes'
import { Link, mapLink } from './link.model'
import { IntroLinkImage, mapIntroLinkImage } from './introLinkImage.model'

enum LinkDataVariant {
  IntroLinkImage = 'IntroLinkImage',
  CategoryCard = 'CategoryCard',
}

registerEnumType(LinkDataVariant, {
  name: 'OverviewLinksLinkDataVariant',
})

@ObjectType('OverviewLinksLinkDataCategoryCardItem')
class CategoryCardItem {
  @Field()
  title!: string

  @Field()
  description!: string

  @Field()
  href!: string
}

@ObjectType('OverviewLinksLinkData')
class LinkData {
  @CacheField(() => LinkDataVariant)
  variant!: LinkDataVariant

  @CacheField(() => [CategoryCardItem])
  categoryCardItems!: CategoryCardItem[]
}

@ObjectType()
export class OverviewLinks {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  titleAbove?: string

  @CacheField(() => [IntroLinkImage])
  overviewLinks!: Array<IntroLinkImage>

  @CacheField(() => Link, { nullable: true })
  link!: Link | null

  @Field(() => Boolean, { nullable: true })
  hasBorderAbove?: boolean

  @CacheField(() => LinkData, { nullable: true })
  linkData?: LinkData | null
}

const mapLinkData = (
  linkData: IOverviewLinks['fields']['linkData'],
): LinkData => {
  return {
    variant:
      linkData?.['variant'] === LinkDataVariant.CategoryCard
        ? LinkDataVariant.CategoryCard
        : LinkDataVariant.IntroLinkImage,
    categoryCardItems:
      linkData?.['categoryCardItems']?.filter(
        (item: { title?: string; href?: string }) =>
          Boolean(item?.title) && Boolean(item?.href),
      ) ?? [],
  }
}

export const mapOverviewLinks = ({
  sys,
  fields,
}: IOverviewLinks): SystemMetadata<OverviewLinks> => ({
  typename: 'OverviewLinks',
  id: sys.id,
  titleAbove: fields.displayedTitle ?? '',
  overviewLinks: (fields.overviewLinks ?? []).map(mapIntroLinkImage),
  link: fields.link ? mapLink(fields.link) : null,
  hasBorderAbove: fields.hasBorderAbove ?? true,
  linkData: mapLinkData(fields.linkData),
})

import { Locale } from '@island.is/shared/types'

import {
  ArticleCategory,
  MenuLinkWithChildren,
  MenuLink,
} from '../graphql/schema'
import { linkResolver, LinkType } from '../hooks/useLinkResolver'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore make web strict
interface FormattedLink {
  text: string
  href: string
  sub: FormattedLink[] | null
}

export const formatMegaMenuLinks = (
  locale: Locale,
  menuLinks: (MenuLinkWithChildren | MenuLink)[],
): FormattedLink[] => {
  return menuLinks
    .map((linkData): FormattedLink | null => {
      let sub: FormattedLink[] | null = null

      if ('childLinks' in linkData) {
        sub = formatMegaMenuLinks(locale, linkData.childLinks)
      }

      if (!linkData.link) {
        return null
      }

      return {
        text: linkData.title,
        href: linkResolver(
          linkData.link.type as LinkType,
          [linkData.link.slug],
          locale,
        ).href,
        sub,
      }
    })
    .filter((linkData): linkData is FormattedLink => Boolean(linkData))
}

export const formatMegaMenuCategoryLinks = (
  locale: Locale,
  categories: ArticleCategory[],
) =>
  categories.map((category) => ({
    text: category.title,
    href: linkResolver(category.__typename as LinkType, [category.slug], locale)
      .href,
  }))

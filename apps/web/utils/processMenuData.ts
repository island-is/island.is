import {
  ArticleCategory,
  MenuLinkWithChildren,
  MenuLink,
} from '../graphql/schema'
import { Locale } from '../i18n/I18n'
import {
  linkResolver,
  LinkResolverResponse,
  LinkType,
} from '../hooks/useLinkResolver'
import { MegaMenuLink } from '../components/Menu/Menu'

export const formatMegaMenuLinks = (
  locale: Locale,
  menuLinks: (MenuLinkWithChildren | MenuLink)[],
): MegaMenuLink[] => {
  return menuLinks
    .filter((linkData) => !!linkData.link)
    .map((linkData) => {
      let sub
      // if this link has children format them
      if ('childLinks' in linkData) {
        sub = formatMegaMenuLinks(locale, linkData.childLinks) as MegaMenuLink[]
      }

      return {
        text: linkData.title,
        href: linkResolver(
          linkData?.link?.type as LinkType,
          [linkData?.link?.slug ?? ''],
          locale,
        ).href as string,
        ...(sub && sub),
      }
    })
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

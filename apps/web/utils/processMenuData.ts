import pathNames, { ContentType } from '../i18n/routes'
import {
  ArticleCategory,
  MenuLinkWithChildren,
  MenuLink,
} from '../graphql/schema'
import { Locale } from '../i18n/I18n'

export const formatMegaMenuLinks = (
  lang: Locale,
  menuLinks: (MenuLinkWithChildren | MenuLink)[],
) => {
  return menuLinks
    .map((linkData) => {
      let sub
      // if this link has children format them
      if ('childLinks' in linkData) {
        sub = formatMegaMenuLinks(lang, linkData.childLinks)
      } else {
        sub = null
      }

      if (!linkData.link) {
        return null
      }

      return {
        text: linkData.title,
        href: pathNames(lang, linkData.link.type as ContentType, [
          linkData.link.slug,
        ]),
        sub,
      }
    })
    .filter((linkData) => Boolean(linkData))
}

export const formatMegaMenuCategoryLinks = (
  lang: Locale,
  categories: ArticleCategory[],
) =>
  categories.map((category) => ({
    text: category.title,
    href: pathNames(lang, category.__typename as ContentType, [category.slug]),
  }))

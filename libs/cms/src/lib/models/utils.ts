import {
  ILink,
  ILinkedPage,
  IOrganizationParentSubpage,
  IOrganizationSubpage,
} from '../generated/contentfulTypes'
import { getOrganizationPageUrlPrefix } from '@island.is/shared/utils'
import { mapLink, Link } from '../models/link.model'

/** Make sure that links are relative in case someone links to production directly */
export const getRelativeUrl = (url: string) => {
  const urlObject = new URL(url.trim(), 'https://island.is')
  if (urlObject.host === 'island.is' || urlObject.host === 'www.island.is') {
    return `${urlObject.pathname}${urlObject.search}${urlObject.hash}`
  }
  return urlObject.href
}

type LinkType = Omit<ILink | ILinkedPage, 'update' | 'toPlainObject'>

export const mapReferenceLink = (link?: LinkType): Link | null => {
  if (!link || !link.sys?.contentType?.sys?.id) return null

  const contentTypeId = link.sys.contentType.sys.id

  if (contentTypeId === 'linkedPage') {
    return generateOrganizationSubpageLinkFromLinkedPage(link as ILinkedPage)
  }

  if (contentTypeId === 'link') {
    return mapLink(link as ILink)
  }

  return null
}

const generateOrganizationSubpageLinkFromLinkedPage = (
  linkedPage: ILinkedPage,
): Link | null => {
  const contentTypeId = linkedPage.fields.page.sys.contentType.sys.id
  let slug: string

  if (contentTypeId === 'organizationParentSubpage') {
    const subpage = linkedPage.fields.page as IOrganizationParentSubpage
    slug = `${subpage.fields.organizationPage.fields.slug}/${subpage.fields.slug}`
  } else if (contentTypeId === 'organizationSubpage') {
    const subpage = linkedPage.fields.page as IOrganizationSubpage
    const parentSlug = subpage.fields.organizationParentSubpage?.fields.slug
    slug = parentSlug
      ? `${subpage.fields.organizationPage.fields.slug}/${parentSlug}/${subpage.fields.slug}`
      : `${subpage.fields.organizationPage.fields.slug}/${subpage.fields.slug}`
  } else {
    return null
  }

  const prefix = getOrganizationPageUrlPrefix(linkedPage.sys.locale)

  return mapLink({
    ...linkedPage,
    sys: {
      ...linkedPage.sys,
      contentType: {
        sys: {
          id: 'link',
          linkType: 'ContentType',
          type: 'Link',
        },
      },
    },
    fields: {
      text: linkedPage.fields.title ?? '',
      url: `/${prefix}/${slug}`,
    },
  })
}

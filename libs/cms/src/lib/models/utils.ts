import type {
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
    const linkedPage = link as ILinkedPage
    const pageType = linkedPage?.fields?.page?.sys?.contentType?.sys?.id
    const locale = linkedPage?.sys?.locale ?? 'is-IS'

    switch (pageType) {
      case 'article': {
        const slug = linkedPage?.fields?.page?.fields?.slug ?? ''
        const title = (linkedPage?.fields?.page?.fields?.title ?? '').trim()
        if (!slug || !title) return null
        return {
          date: '',
          id: '',
          text: title,
          url: `/${locale === 'en' ? 'en/' : ''}${slug}`,
          labels: [],
        }
      }
      case 'articleCategory': {
        const slug = linkedPage?.fields?.page?.fields?.slug ?? ''
        const title = (linkedPage?.fields?.page?.fields?.title ?? '').trim()
        if (!slug || !title) return null
        return {
          date: '',
          id: '',
          text: title,
          url: `/${locale === 'en' ? 'en/category' : 'flokkur'}/${slug}`,
          labels: [],
        }
      }
      case 'news':
        return null
      default:
        return generateOrganizationSubpageLinkFromLinkedPage(
          link as ILinkedPage,
        )
    }
  }

  if (contentTypeId === 'link') {
    return mapLink(link as ILink)
  }

  return null
}

export const generateOrganizationSubpageUrl = (
  subpage: IOrganizationSubpage,
) => {
  const prefix = getOrganizationPageUrlPrefix(subpage.sys.locale)
  const parentSlug = subpage.fields.organizationParentSubpage?.fields.slug
  const url = parentSlug
    ? `${subpage.fields.organizationPage.fields.slug}/${parentSlug}/${subpage.fields.slug}`
    : `${subpage.fields.organizationPage.fields.slug}/${subpage.fields.slug}`
  return `/${prefix}/${url}`
}

const generateOrganizationParentSubpageUrl = (
  parentSubpage: IOrganizationParentSubpage,
) => {
  const prefix = getOrganizationPageUrlPrefix(parentSubpage.sys.locale)
  const url = `${parentSubpage.fields.organizationPage.fields.slug}/${parentSubpage.fields.slug}`
  return `/${prefix}/${url}`
}

const generateOrganizationSubpageLinkFromLinkedPage = (
  linkedPage: ILinkedPage,
): Link | null => {
  const contentTypeId = linkedPage.fields.page.sys.contentType.sys.id
  let url = ''

  if (contentTypeId === 'organizationParentSubpage') {
    url = generateOrganizationParentSubpageUrl(
      linkedPage.fields.page as IOrganizationParentSubpage,
    )
  } else if (contentTypeId === 'organizationSubpage') {
    url = generateOrganizationSubpageUrl(
      linkedPage.fields.page as IOrganizationSubpage,
    )
  } else {
    return null
  }

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
      url,
    },
  })
}

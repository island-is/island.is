import { DEFAULT_LOCALE } from '../constants'

/**
 * Subpage content types an editor can create or link from a link group field,
 * keyed by the content type of the page the link group belongs to.
 * Parent subpage types are listed first.
 */
const SUBPAGE_CONTENT_TYPE_IDS: Record<string, string[]> = {
  organizationPage: ['organizationParentSubpage', 'organizationSubpage'],
  projectPage: ['projectParentSubpage', 'projectSubpage'],
}

export const getSubpageContentTypeIds = (
  pageContentTypeId?: string,
): string[] | null => {
  if (!pageContentTypeId) return null
  const ids = SUBPAGE_CONTENT_TYPE_IDS[pageContentTypeId]
  return ids ? [...ids] : null
}

interface PageAbove {
  sys?: {
    id?: string
    contentType?: { sys?: { id?: string } }
  }
}

/**
 * Builds the initial fields for a new subpage entry so that it links back to
 * the page above the link group. Returns an empty object if the subpage type
 * does not belong to the page above.
 */
export const getSubpagePrefillFields = (
  contentTypeId: string,
  pageAbove?: PageAbove | null,
): Record<string, unknown> => {
  const pageAboveId = pageAbove?.sys?.id
  const pageAboveContentTypeId = pageAbove?.sys?.contentType?.sys?.id

  if (
    !pageAboveId ||
    !getSubpageContentTypeIds(pageAboveContentTypeId)?.includes(contentTypeId)
  ) {
    return {}
  }

  if (pageAboveContentTypeId === 'organizationPage') {
    return {
      organizationPage: {
        [DEFAULT_LOCALE]: {
          sys: {
            id: pageAboveId,
            linkType: 'Entry',
          },
        },
      },
    }
  }

  if (pageAboveContentTypeId === 'projectPage') {
    return {
      projectPage: {
        [DEFAULT_LOCALE]: {
          sys: {
            type: 'Link',
            id: pageAboveId,
            linkType: 'Entry',
          },
        },
      },
    }
  }

  return {}
}

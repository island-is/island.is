import { DEFAULT_LOCALE } from '../constants'
import {
  getSubpageContentTypeIds,
  getSubpagePrefillFields,
} from './linkGroupSubpages'

const page = (contentTypeId: string, id = 'page-id') => ({
  sys: { id, contentType: { sys: { id: contentTypeId } } },
})

describe('getSubpageContentTypeIds', () => {
  it('returns organization subpage types with the parent first', () => {
    expect(getSubpageContentTypeIds('organizationPage')).toEqual([
      'organizationParentSubpage',
      'organizationSubpage',
    ])
  })

  it('returns project subpage types with the parent first', () => {
    expect(getSubpageContentTypeIds('projectPage')).toEqual([
      'projectParentSubpage',
      'projectSubpage',
    ])
  })

  it('returns null for unknown or missing page types', () => {
    expect(getSubpageContentTypeIds('article')).toBeNull()
    expect(getSubpageContentTypeIds(undefined)).toBeNull()
    expect(getSubpageContentTypeIds('')).toBeNull()
  })

  it('returns a copy that callers can mutate safely', () => {
    getSubpageContentTypeIds('projectPage')?.push('link')
    expect(getSubpageContentTypeIds('projectPage')).toHaveLength(2)
  })
})

describe('getSubpagePrefillFields', () => {
  const organizationLink = {
    organizationPage: {
      [DEFAULT_LOCALE]: { sys: { id: 'org-1', linkType: 'Entry' } },
    },
  }
  const projectLink = {
    projectPage: {
      [DEFAULT_LOCALE]: {
        sys: { type: 'Link', id: 'proj-1', linkType: 'Entry' },
      },
    },
  }

  it.each(['organizationSubpage', 'organizationParentSubpage'])(
    'links %s to the organization page above',
    (contentTypeId) => {
      expect(
        getSubpagePrefillFields(
          contentTypeId,
          page('organizationPage', 'org-1'),
        ),
      ).toEqual(organizationLink)
    },
  )

  it.each(['projectSubpage', 'projectParentSubpage'])(
    'links %s to the project page above',
    (contentTypeId) => {
      expect(
        getSubpagePrefillFields(contentTypeId, page('projectPage', 'proj-1')),
      ).toEqual(projectLink)
    },
  )

  it.each([
    ['projectSubpage', 'organizationPage'],
    ['projectParentSubpage', 'organizationPage'],
    ['organizationSubpage', 'projectPage'],
    ['organizationParentSubpage', 'projectPage'],
  ])(
    'returns no fields for %s under a %s (mismatched page type)',
    (contentTypeId, pageContentTypeId) => {
      expect(
        getSubpagePrefillFields(contentTypeId, page(pageContentTypeId)),
      ).toEqual({})
    },
  )

  it('returns no fields for the generic link content type', () => {
    expect(getSubpagePrefillFields('link', page('projectPage'))).toEqual({})
    expect(getSubpagePrefillFields('link', page('organizationPage'))).toEqual(
      {},
    )
  })

  it('returns no fields when the page above has an unknown type', () => {
    expect(getSubpagePrefillFields('projectSubpage', page('article'))).toEqual(
      {},
    )
    expect(
      getSubpagePrefillFields('projectParentSubpage', page('anchorPage')),
    ).toEqual({})
  })

  it('returns no fields when there is no page above', () => {
    expect(getSubpagePrefillFields('projectParentSubpage', null)).toEqual({})
    expect(getSubpagePrefillFields('projectParentSubpage')).toEqual({})
    expect(
      getSubpagePrefillFields('projectParentSubpage', {
        sys: { contentType: { sys: { id: 'projectPage' } } },
      }),
    ).toEqual({})
  })
})

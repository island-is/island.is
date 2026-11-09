import type { GroupedByTagSearchGroup } from '@island.is/content-search-toolkit'
import {
  addParentSubpageSlugToChapters,
  getProjectPageSearchChildLinks,
  mapProjectPageChildMatches,
} from './projectPageSearch'

const group = (
  key: string,
  maxScore: number | null,
  responses: object[],
): GroupedByTagSearchGroup => ({
  key,
  doc_count: responses.length,
  documents: {
    maxScore: { value: maxScore },
    topHits: {
      hits: {
        hits: responses.map((response, index) => ({
          _id: String(index),
          _score: 1,
          _source: { response: JSON.stringify(response) },
        })),
      },
    },
  },
})

const subpage = (id: string, slug: string, projectPageId = 'p1') => ({
  typename: 'ProjectSubpage',
  id,
  title: `Title ${id}`,
  slug,
  projectPageId,
})

const parent = (
  id: string,
  slug: string,
  chapters: { id: string; slug: string }[],
) => ({
  typename: 'ProjectParentSubpage',
  id,
  title: `Title ${id}`,
  slug,
  projectPageId: 'p1',
  chapters: chapters.map((chapter) => ({
    ...chapter,
    title: `Title ${chapter.id}`,
  })),
})

describe('mapProjectPageChildMatches', () => {
  it('drops children of other project pages and groups without a score', () => {
    const matches = mapProjectPageChildMatches([
      group('p1', 5, [subpage('a', 'a'), subpage('b', 'b', 'p2')]),
      group('p2', null, [subpage('c', 'c', 'p2')]),
      { ...group('p3', 1, []), key: 'p3' },
    ])

    expect(matches).toHaveLength(1)
    expect(matches[0].projectPageId).toBe('p1')
    expect(matches[0].children.map((child) => child.id)).toEqual(['a'])
  })

  it('ignores responses that are not valid json', () => {
    const broken = group('p1', 5, [subpage('a', 'a')])
    broken.documents.topHits.hits.hits.push({
      _id: 'x',
      _score: 1,
      _source: { response: '{' },
    })

    expect(mapProjectPageChildMatches([broken])[0].children).toHaveLength(1)
  })
})

describe('getProjectPageSearchChildLinks', () => {
  const projectPage = {
    id: 'p1',
    slug: 'project',
    sidebarLinks: [
      { primaryLink: { id: 'nav-1', text: 'Nav 1', url: '/v/project/nav-1' } },
      { primaryLink: { id: 'a', text: 'Short a', url: '/v/project/a' } },
      { primaryLink: { id: 'ext', text: 'External', url: 'https://x.is' } },
      { primaryLink: { id: 'front', text: 'Forsíða', url: '/v/project' } },
      { primaryLink: null },
      { primaryLink: { id: 'nav-2', text: 'Nav 2', url: '/v/project/nav-2' } },
      { primaryLink: { id: 'nav-3', text: 'Nav 3', url: '/v/project/nav-3' } },
    ],
  }

  it('lists matching subpages first and fills up with navigation links', () => {
    const [matches] = mapProjectPageChildMatches([
      group('p1', 5, [subpage('a', 'a'), subpage('b', 'b')]),
    ])

    expect(getProjectPageSearchChildLinks(projectPage, matches, 'is')).toEqual([
      { id: 'a', label: 'Title a', href: '/v/project/a' },
      { id: 'b', label: 'Title b', href: '/v/project/b' },
      { id: 'nav-1', label: 'Nav 1', href: '/v/project/nav-1' },
      { id: 'nav-2', label: 'Nav 2', href: '/v/project/nav-2' },
    ])
  })

  it('only uses navigation links when no subpage matches', () => {
    expect(
      getProjectPageSearchChildLinks(projectPage, undefined, 'is').map(
        (link) => link.id,
      ),
    ).toEqual(['nav-1', 'a', 'nav-2', 'nav-3'])
  })

  it('shows matching chapters under their parent subpage instead of the parent itself', () => {
    const [matches] = mapProjectPageChildMatches([
      group('p1', 5, [
        subpage('chapter', 'chapter'),
        parent('parent', 'guide', [{ id: 'chapter', slug: 'chapter' }]),
      ]),
    ])

    expect(
      getProjectPageSearchChildLinks(
        {
          slug: 'project',
          // The parent is not added again from the navigation
          sidebarLinks: [
            {
              primaryLink: {
                id: 'guide-nav',
                text: 'Guide',
                url: '/v/project/guide',
              },
            },
          ],
        },
        matches,
        'is',
      ),
    ).toEqual([
      {
        id: 'chapter',
        label: 'Title chapter',
        href: '/v/project/guide/chapter',
      },
    ])
  })

  it('shows a matching parent subpage when none of its chapters match', () => {
    const [matches] = mapProjectPageChildMatches([
      group('p1', 5, [
        subpage('other', 'other'),
        parent('parent', 'guide', [{ id: 'chapter', slug: 'chapter' }]),
      ]),
    ])

    expect(
      getProjectPageSearchChildLinks({ slug: 'project' }, matches, 'is'),
    ).toEqual([
      { id: 'other', label: 'Title other', href: '/v/project/other' },
      { id: 'parent', label: 'Title parent', href: '/v/project/guide' },
    ])
  })

  it('uses the english url prefix', () => {
    const [matches] = mapProjectPageChildMatches([
      group('p1', 5, [subpage('a', 'a')]),
    ])

    expect(
      getProjectPageSearchChildLinks({ slug: 'project' }, matches, 'en'),
    ).toEqual([{ id: 'a', label: 'Title a', href: '/en/p/project/a' }])
  })

  it('returns no links when the project page has no slug', () => {
    const [matches] = mapProjectPageChildMatches([
      group('p1', 5, [subpage('a', 'a')]),
    ])

    expect(getProjectPageSearchChildLinks({}, matches, 'is')).toEqual([])
  })
})

describe('addParentSubpageSlugToChapters', () => {
  it('only adds the parent subpage slug to subpages that are its chapters', () => {
    const items: {
      typename: string
      id: string
      parentSubpageSlug?: string
    }[] = [
      subpage('chapter', 'chapter'),
      subpage('standalone', 'standalone'),
      parent('guide', 'guide', [{ id: 'chapter', slug: 'chapter' }]),
    ]

    addParentSubpageSlugToChapters(items, [
      JSON.stringify(
        parent('guide', 'guide', [{ id: 'chapter', slug: 'chapter' }]),
      ),
      'not json',
      undefined,
    ])

    expect(items.map((item) => item.parentSubpageSlug)).toEqual([
      'guide',
      undefined,
      undefined,
    ])
  })
})

import {
  GetGrantsInputSortByEnum,
  GrantCardsListSorting,
} from '@island.is/web/graphql/schema'

import {
  buildGrantsQueryInput,
  getCappedTotal,
  getVisibleCountOnPage,
  GRANT_CARDS_PAGE_SIZE,
} from './utils'

describe('getCappedTotal', () => {
  it('caps the total', () => {
    expect(getCappedTotal(50, 20)).toBe(20)
  })

  it('keeps a total below the cap', () => {
    expect(getCappedTotal(7, 20)).toBe(7)
  })

  it('returns the total when there is no cap', () => {
    expect(getCappedTotal(50, null)).toBe(50)
  })

  it('returns zero when the cap is zero', () => {
    expect(getCappedTotal(50, 0)).toBe(0)
  })
})

describe('getVisibleCountOnPage', () => {
  it('shows a full first page', () => {
    expect(getVisibleCountOnPage(1, 12, GRANT_CARDS_PAGE_SIZE)).toBe(10)
  })

  it('shows the remainder on the last page', () => {
    expect(getVisibleCountOnPage(2, 12, GRANT_CARDS_PAGE_SIZE)).toBe(2)
  })

  it('shows nothing past the cap', () => {
    expect(getVisibleCountOnPage(3, 12, GRANT_CARDS_PAGE_SIZE)).toBe(0)
  })

  it('caps below one page', () => {
    expect(getVisibleCountOnPage(1, 8, GRANT_CARDS_PAGE_SIZE)).toBe(8)
  })

  it('shows a full page when there is no cap', () => {
    expect(getVisibleCountOnPage(4, null, GRANT_CARDS_PAGE_SIZE)).toBe(10)
  })

  it('shows nothing when the cap is zero', () => {
    expect(getVisibleCountOnPage(1, 0, GRANT_CARDS_PAGE_SIZE)).toBe(0)
  })
})

describe('buildGrantsQueryInput', () => {
  const base = {
    lang: 'is' as const,
    page: 2,
    searchValue: 'nam',
    tags: ['flokkur-a'],
    tagGroups: { flokkur: ['flokkur-a', 'flokkur-b'] },
    maxNumberOfCards: 20,
  }

  it('omits the fund filter when the list has no funds', () => {
    const input = buildGrantsQueryInput({
      ...base,
      fundIds: [],
      showPagination: true,
    })
    expect(input).not.toBeNull()
    expect(input?.funds).toBeUndefined()
  })

  it('leaves the size to the server default when pagination is off and there is no cap', () => {
    const input = buildGrantsQueryInput({
      ...base,
      fundIds: ['f1'],
      showPagination: false,
      maxNumberOfCards: null,
    })
    expect(input?.size).toBeUndefined()
  })

  it('returns null when the cap is zero', () => {
    expect(
      buildGrantsQueryInput({
        ...base,
        fundIds: ['f1'],
        showPagination: true,
        maxNumberOfCards: 0,
      }),
    ).toBeNull()
  })

  it('pages with server sort when pagination is on', () => {
    expect(
      buildGrantsQueryInput({
        ...base,
        fundIds: ['f1'],
        showPagination: true,
        sorting: GrantCardsListSorting.Alphabetical,
      }),
    ).toEqual({
      funds: ['f1'],
      lang: 'is',
      page: 2,
      size: 10,
      search: 'nam',
      categories: ['flokkur-a'],
      tagGroups: { flokkur: ['flokkur-a', 'flokkur-b'] },
      sort: GetGrantsInputSortByEnum.Alphabetical,
    })
  })

  it('sorts by recently updated when pagination is on and sorting is not alphabetical', () => {
    expect(
      buildGrantsQueryInput({
        ...base,
        fundIds: ['f1'],
        showPagination: true,
        sorting: GrantCardsListSorting.MostRecentlyUpdatedFirst,
      })?.sort,
    ).toBe(GetGrantsInputSortByEnum.RecentlyUpdated)
  })

  it('fetches one capped page when pagination is off', () => {
    expect(
      buildGrantsQueryInput({
        ...base,
        fundIds: ['f1'],
        showPagination: false,
        sorting: GrantCardsListSorting.Alphabetical,
      }),
    ).toEqual({
      funds: ['f1'],
      lang: 'is',
      page: 1,
      size: 20,
      search: 'nam',
      categories: ['flokkur-a'],
      tagGroups: { flokkur: ['flokkur-a', 'flokkur-b'] },
      sort: GetGrantsInputSortByEnum.Alphabetical,
    })
  })

  it('leaves out empty search and categories', () => {
    const input = buildGrantsQueryInput({
      ...base,
      searchValue: '',
      tags: [],
      fundIds: ['f1'],
      showPagination: true,
    })
    expect(input?.search).toBeUndefined()
    expect(input?.categories).toBeUndefined()
    expect(input?.tagGroups).toBeUndefined()
  })
})

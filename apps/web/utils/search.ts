import {
  GetSearchResultsDetailedQuery,
  GetSearchResultsQuery,
} from '../graphql/schema'

const TRYGGINGASTOFNUN_ORGANIZATION_PAGE_CMS_ID = '6IcAmT2PvhiITeydiNAEk1'

export const finetuneSearchResults = (
  queryString: string,
  searchResults:
    | GetSearchResultsQuery['searchResults']
    | GetSearchResultsDetailedQuery['searchResults']
    | undefined,
  locale: string,
): typeof searchResults => {
  if (locale !== 'is' || !searchResults) {
    return searchResults
  }

  const queryStringMatchesAnyTryggingastofnunPrefix = [
    'tr',
    'try',
    'tryg',
    'trygg',
    'tryggi',
    'tryggin',
    'trygging',
    'trygginga',
    'tryggingas',
    'tryggingast',
    'tryggingasto',
    'tryggingastof',
    'tryggingastofn',
    'tryggingastofnu',
    'tryggingastofnun',
  ].includes(queryString.trim().toLowerCase())

  // No need to fine tune search results in case user is not searching for a prefix of the word 'Tryggingastofnun'
  if (!queryStringMatchesAnyTryggingastofnunPrefix) {
    return searchResults
  }

  const items = [...searchResults.items] as typeof searchResults.items

  const index = items.findIndex(
    (item) =>
      item?.__typename === 'OrganizationPage' &&
      item.id === TRYGGINGASTOFNUN_ORGANIZATION_PAGE_CMS_ID,
  )

  const searchResultContainsTryggingastofnunAlready = index >= 0

  // In case that 'Tryggingastofnun' is already a result we'll make sure it's at the top
  if (searchResultContainsTryggingastofnunAlready) {
    const tryggingastofnunResult = items[index]
    items.splice(index, 1)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items.unshift(tryggingastofnunResult as any)
    return {
      ...searchResults,
      items,
    } as typeof searchResults
  }

  const logoUrl =
    'https://images.ctfassets.net/8k0h54kbe6bj/5kBsuX10jRLio9X7kawakg/da51516ab8fa585f29e7a424d44dfb2c/logo-epli1.svg'

  // Add a mocked version of the 'Tryggingastofnun' organization page as a top result
  items.unshift({
    id: '6IcAmT2PvhiITeydiNAEk1',
    slug: 'tryggingastofnun',
    title: 'Tryggingastofnun',
    __typename: 'OrganizationPage',
    singleOrganization: {
      __typename: 'Organization',
      logo: {
        url: logoUrl,
        id: logoUrl,
        contentType: 'image/svg',
        height: 70,
        width: 70,
        title: 'Tryggingastofnun - logo',
        __typename: 'Image',
      },
    },
  })

  return {
    ...searchResults,
    items,
    total:
      // In case we've added a result we'd like that to be reflected in the total
      items.length > searchResults.total ? items.length : searchResults.total,
  } as typeof searchResults
}

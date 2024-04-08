import {
  GetSearchResultsDetailedQuery,
  GetSearchResultsQuery,
} from '../graphql/schema'

export const finetuneSearchResultItems = (
  queryString: string,
  searchResultItems:
    | GetSearchResultsQuery['searchResults']['items']
    | GetSearchResultsDetailedQuery['searchResults']['items'],
  locale: string,
): typeof searchResultItems => {
  if (
    locale !== 'is' ||
    ![
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
  ) {
    return searchResultItems
  }

  // Make sure that when users type in "tr" or "try" they'll see "Tryggingastofnun" at the top
  const items = [...searchResultItems] as typeof searchResultItems

  const tryggingastofnunId = '6IcAmT2PvhiITeydiNAEk1'

  const index = items.findIndex(
    (item) =>
      item?.__typename === 'OrganizationPage' && item.id === tryggingastofnunId,
  )

  // In case that 'Tryggingastofnun' is already a result we'll make sure it's at the top
  if (index >= 0) {
    const temp = items[0]
    items[0] = items[index]
    items[index] = temp
    return items
  }

  const logoUrl =
    'https://images.ctfassets.net/8k0h54kbe6bj/5kBsuX10jRLio9X7kawakg/da51516ab8fa585f29e7a424d44dfb2c/logo-epli1.svg'

  items.unshift({
    id: '6IcAmT2PvhiITeydiNAEk1',
    slug: 'tryggingastofnun',
    title: 'Tryggingastofnun',
    __typename: 'OrganizationPage',
    singleOrganization: {
      __typename: 'Organization',
      logo: {
        url: logoUrl,
        contentType: 'image/svg',
        height: 70,
        width: 70,
        id: logoUrl,
        title: 'Tryggingastofnun - logo',
        __typename: 'Image',
      },
    },
  })

  return items
}

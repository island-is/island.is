import { defineMessages } from 'react-intl'

export const m = defineMessages({
  searchPlaceholder: {
    id: 'web.enhancedAssetList:searchPlaceholder',
    defaultMessage: 'Sía eftir leitarorði',
    description: 'Placeholder for the search input',
  },
  noResultsFound: {
    id: 'web.enhancedAssetList:noResultsFound',
    defaultMessage: 'Ekkert efni fannst.',
    description: 'Message shown when no assets match the search',
  },
  seeMore: {
    id: 'web.enhancedAssetList:seeMore',
    defaultMessage: 'Sjá meira',
    description: 'Load more button label',
  },
  errorLoading: {
    id: 'web.enhancedAssetList:errorLoading',
    defaultMessage:
      'Villa kom upp við að sækja efni. Vinsamlegast reyndu aftur síðar.',
    description: 'Error message when assets fail to load',
  },
})
